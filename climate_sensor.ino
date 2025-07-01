#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

#define SEALEVELPRESSURE_HPA (1013.25)

const char* ssid = "<WIFI_SSID>";
const char* password = "<WIFI_PASSWORD>";

const char* host = "<HOST_URL>";
const char* apiUrl = "/api/climate";
const int httpsPort = 443;
const char* token = "<CLIMATE_CONTROL_SECRET>";

Adafruit_BME280 bme;

void setup() {
  Serial.begin(115200);
  delay(100);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" connected.");

  // Initialize sensor
  if (!bme.begin(0x76)) {
    Serial.println("Could not find a valid BME280 sensor!");
    while (1);
  }
}

void loop() {
  float temperature = bme.readTemperature();
  float humidity = bme.readHumidity();

  Serial.printf("Temp: %.2f C, Humidity: %.2f%%\n", temperature, humidity);

  WiFiClientSecure client;
  client.setInsecure(); // skip SSL certificate verification

  if (!client.connect(host, httpsPort)) {
    Serial.println("Connection failed!");
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
  client.println("Host: " + String(host));
  client.println("Content-Type: application/json");
  client.print("Content-Length: ");
  client.println(requestBody.length());
  client.println();
  client.println(requestBody);

  // Read and print the response
  while (client.connected()) {
    String line = client.readStringUntil('\n');
    if (line == "\r") break;
  }

  String response = client.readString();
  Serial.println("Response:");
  Serial.println(response);

  delay(15000); // Wait 15 seconds before sending next reading
}
