import * as fs from 'fs';
import { extname, join } from 'path';
import { promisify } from 'util';
import { parseString } from 'xml2js';
import { PrepareExecutorSchema } from './schema';
import { Series, Episode } from '@bb/api-interfaces';
import { BaseData } from '../../types';

const parseXml = promisify(parseString);

export type JSONValue = string | number | boolean | object | JSONValue[]

interface FileSourceData {
  Data: {
    Series: JSONValue;
    Episode: JSONValue[];
  };
}

interface ProcessedJson {
  series: Series;
  episode: Episode[];
}

export default async function runExecutor(options: PrepareExecutorSchema) {
  const cwd = process.cwd();
  const dataSrcDir = join(cwd, 'data/xml');
  const dataTargetDir = join(cwd, 'apps/binge-buddy/src/assets');
  const targetDataJSON: BaseData = {series: [], episodes: []};

  console.log('Data source directory:', dataSrcDir);

  // Create the target directory if it doesn't exist
  if (!fs.existsSync(dataTargetDir)) {
    fs.mkdirSync(dataTargetDir, {recursive: true});
    console.log('Data target directory created:', dataTargetDir);
  }

  try {
    const files = fs.readdirSync(dataSrcDir);
    const parsePromises: Promise<void>[] = [];

    files.forEach((file) => {
      if (extname(file) === '.xml') {
        const filePath = join(dataSrcDir, file);
        const promise = fs.promises.readFile(filePath, 'utf8').then(async (data) => {
          try {
            const jsonData: FileSourceData = await parseXml(data) as FileSourceData;
            const flattenedJson = jsonData.Data && typeof jsonData.Data === "object" ? jsonData.Data : jsonData;
            const sanitizedJson = processJson(flattenedJson) as ProcessedJson;
            const seriesId = sanitizedJson.series.id;
            targetDataJSON.series.push(sanitizedJson.series);
            targetDataJSON.episodes.push(
              ...sanitizedJson.episode.map((episode: Episode) => ({...episode, seriesId}))
            );
          } catch (err) {
            console.error('Error converting XML to JSON:', err);
          }
        });

        parsePromises.push(promise);
      }
    });

    await Promise.all(parsePromises);
  } catch (err) {
    console.error('Error reading data source directory:', err);
  }

  const jsonFilePath = join(dataTargetDir, 'data.json');
  fs.writeFileSync(jsonFilePath, JSON.stringify(targetDataJSON, null, 2));

  console.log('Executor ran for Prepare', options);
  return {
    success: true,
  };
}

export function processJson(json: JSONValue): JSONValue {
  if (typeof json === 'string') {
    return processString(json);
  } else if (typeof json === 'object') {
    if (Array.isArray(json)) {
      if (json.length === 1) {
        return processJson(json[0]);
      }
      return json.map((item) => processJson(item)) as JSONValue[];
    } else {
      const targetJson: Record<string, JSONValue> = {};

      for (const key in json) {
        // eslint-disable-next-line no-prototype-builtins
        if (json.hasOwnProperty(key)) {
          const sanitizedKey = convertStringToCamelCase(key);
          const jsonValue = (json as Record<string, JSONValue>)[key];

          if (typeof jsonValue === 'string') {
            targetJson[sanitizedKey] = processString(jsonValue);
          } else if (typeof jsonValue === 'object') {
            if (Array.isArray(jsonValue) && jsonValue.length === 1) {
              targetJson[sanitizedKey] = processJson(jsonValue[0]);
            } else {
              targetJson[sanitizedKey] = processJson(jsonValue);
            }
          }
        }
      }

      return targetJson;
    }
  }

  return json;
}


export function convertStringToCamelCase(inputString: string): string {
  return inputString
    .split('_')
    .map((part, index) => (index === 0 ? part.toLowerCase() : part.charAt(0).toUpperCase() + part.slice(1)))
    .join('');
}

export function processString(str: string): JSONValue {
  const sanitizedString = str.replace(/\s+/g, ' ').trim();
  if (sanitizedString.includes('|')) {
    return sanitizedString.split('|').filter((item) => item !== '').map((item) => processString(item));
  }
  const parsedNumber = Number(sanitizedString);
  return isNaN(parsedNumber) ? sanitizedString : parsedNumber;
}
