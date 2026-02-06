#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

#define SEALEVELPRESSURE_HPA (1013.25)

// WiFi
const char* ssid = "Vodafone-9DEF";
const char* password = "PyFbuCCBFCiWCayW";

const char* host = "192.168.0.73";
const int httpPort = 80;

const char* apiUrl = "/api/climate";
const char* token = "b1db5b4b-900e-4ef6-b81e-3b1004f1a81a";

Adafruit_BME280 bme;

void setup() {
  Serial.begin(115200);
  delay(100);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" connected.");

  if (!bme.begin(0x76)) {
    Serial.println("Could not find a valid BME280 sensor!");
    while (1);
  }
}

void loop() {
  float temperature = bme.readTemperature();
  float humidity = bme.readHumidity();

  Serial.printf("Temp: %.2f C, Humidity: %.2f%%\n", temperature, humidity);

  // Use WiFiClient for HTTP (Use WiFiClientSecure only for HTTPS/443)
  WiFiClient client;

  // CONNECT: Note we use the new 'port' variable (3000)
  if (!client.connect(host, httpPort)) {
    Serial.println("Connection failed!");
    delay(10000); // Wait 10 seconds before next reading
    return;
  }

  // Create JSON body
  StaticJsonDocument<200> doc;
  doc["token"] = token;
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;

  String requestBody;
  serializeJson(doc, requestBody);

  // Send HTTP POST
  client.println("POST " + String(apiUrl) + " HTTP/1.1");
  // Host header usually includes the port if it's non-standard
  client.println("Host: " + String(host));
  client.println("Content-Type: application/json");
  client.print("Content-Length: ");
  client.println(requestBody.length());
  client.println();
  client.println(requestBody);

  // Read response
  while (client.connected()) {
    String line = client.readStringUntil('\n');
    if (line == "\r") break;
  }

  String response = client.readString();
  Serial.println("Response:");
  Serial.println(response);

  delay(10000); // Wait 10 seconds before next reading
}
