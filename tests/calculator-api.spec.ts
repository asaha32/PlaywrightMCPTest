import { test, expect } from '@playwright/test';
import axios from 'axios';

const WSDL_URL = 'http://www.dneonline.com/calculator.asmx';
const SOAP_ACTIONS = {
  Add: 'http://tempuri.org/Add',
  Subtract: 'http://tempuri.org/Subtract',
  Multiply: 'http://tempuri.org/Multiply',
  Divide: 'http://tempuri.org/Divide',
};

function buildSoapEnvelope(operation: string, params: Record<string, number>) {
  const paramXml = Object.entries(params)
    .map(([k, v]) => `<${k}>${v}</${k}>`)
    .join('');
  return `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <${operation} xmlns="http://tempuri.org/">
          ${paramXml}
        </${operation}>
      </soap:Body>
    </soap:Envelope>`;
}

test.describe('Calculator SOAP API', () => {
  for (const [operation, soapAction] of Object.entries(SOAP_ACTIONS)) {
    test(`${operation} operation`, async () => {
      const params = { intA: 10, intB: 5 };
      const envelope = buildSoapEnvelope(operation, params);
      const { data, status } = await axios.post(WSDL_URL, envelope, {
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          'SOAPAction': soapAction,
        },
      });
      expect(status).toBe(200);
      // Basic check for SOAP response
      expect(data).toContain(`<${operation}Result>`);
      // Optionally, parse the result value
      const match = data.match(new RegExp(`<${operation}Result>(\\d+)<\/${operation}Result>`));
      expect(match).not.toBeNull();
      const result = match ? parseInt(match[1], 10) : NaN;
      let expected;
      switch (operation) {
        case 'Add': expected = 15; break;
        case 'Subtract': expected = 5; break;
        case 'Multiply': expected = 50; break;
        case 'Divide': expected = 2; break;
      }
      expect(result).toBe(expected);
    });
  }
});
