import { PrepareExecutorSchema } from './schema';
import executor, { convertStringToCamelCase, processString, processJson, JSONValue } from './executor';

const options: PrepareExecutorSchema = {};

describe('Prepare Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });

  describe('tryParseNumber', () => {
    it('correctly transforms a numeric string into a number', () => {
      const numericString = "42";
      const expectedNumber = 42;
      const transformedValue = processString(numericString);
      expect(transformedValue).toBe(expectedNumber);
    });

    it('correctly handles non-numeric string', () => {
      const nonNumericString = "Hello";
      const transformedValue = processString(nonNumericString);
      expect(transformedValue).toBe("Hello");
    });
  });

  describe('processString', () => {
    it('correctly splits a string with | character into an array', () => {
      const pipeSeparatedString = "apple|banana|cherry";
      const expectedArray = ["apple", "banana", "cherry"];
      const transformedValue = processString(pipeSeparatedString);
      expect(transformedValue).toEqual(expectedArray);
    });

    it('correctly sanitizes white spaces in a string', () => {
      const stringWithExtraSpaces = "  This  is    a    string  ";
      const expectedString = "This is a string";
      const transformedValue = processString(stringWithExtraSpaces);
      expect(transformedValue).toBe(expectedString);
    });
  });

  describe('convertStringToCamelCase', () => {
    it('correctly converts a snake_case string to camelCase', () => {
      const snakeCaseString = "this_is_snake_case";
      const expectedCamelCase = "thisIsSnakeCase";
      const transformedValue = convertStringToCamelCase(snakeCaseString);
      expect(transformedValue).toBe(expectedCamelCase);
    });
  });

  describe('processJson', () => {
    it('correctly processes a JSON object with mixed values', () => {
      const inputJson: JSONValue = {
        name: " Alice  |Bob  ",
        age: "30",
        address: "123 Main St",
      };

      const expectedJson = {
        name: ["Alice", "Bob"],
        age: 30,
        address: "123 Main St",
      };
      const transformedValue = processJson(inputJson);
      expect(transformedValue).toEqual(expectedJson);
    });

    it('correctly processes arrays with single element', () => {
      const inputJson: JSONValue = {
        name: [" Alice \n"],
        age: [" 30 "],
        address: [" 123 Main St"],
      }

      const expectedJson = {
        name: "Alice",
        age: 30,
        address: "123 Main St",
      };
      const transformedValue = processJson(inputJson);
      expect(transformedValue).toEqual(expectedJson);
    });
  });

});
