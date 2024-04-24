#include <Arduino_JSON.h>

const int led1 = 5;
const int led2 = 4;
const int led3 = 3;
const int joyXPin = A0;
const int joyYPin = A1;
const int switchPin = 2;
const int maxCalibrationFrames = 3;

float xValue, yValue;
int startX, startY;
float pXValue = -1, pYValue = -1;
float alpha = 0.2;
int calibrationFrames = 0;

JSONVar sensorData;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(38400);

  pinMode(switchPin, INPUT);
  digitalWrite(switchPin, HIGH);

  pinMode(led1, OUTPUT);
  digitalWrite(led1, LOW); // HIGH
  pinMode(led2, OUTPUT);
  digitalWrite(led2, LOW);
  pinMode(led3, OUTPUT);
  digitalWrite(led3, LOW);
}

void loop() {
  xValue = analogRead(joyXPin);
  yValue = analogRead(joyYPin);

  if (pXValue == -1) {
    pXValue = xValue;
    pYValue = yValue;
  }

  xValue = pXValue + alpha*(xValue - pXValue);
  yValue = pYValue + alpha*(yValue - pYValue);
  
  if (calibrationFrames < maxCalibrationFrames) {
    calibrationFrames++;
    startX = xValue;
    startY = yValue;
  }
  else {
    sensorData["x"] = (int) (xValue - startX);
    sensorData["y"] = (int) (yValue - startY);
    sensorData["sw"] = digitalRead(switchPin) == LOW;

    Serial.println(sensorData);
  }

  if (Serial.available() > 0) {
    String jsonString = Serial.readStringUntil("\n");
    if (jsonString != '\n') {
      JSONVar serialInput = JSON.parse(jsonString);

      if (JSON.typeof(serialInput) == "undefined") {
        Serial.println("JSON parsing failed!");
      } else {
        int x = (int) serialInput["number"];
        if (x == 3) {
          digitalWrite(led1, HIGH);
          digitalWrite(led2, HIGH);
          digitalWrite(led3, HIGH);
        } else if(x == 2) {
          digitalWrite(led1, HIGH);
          digitalWrite(led2, HIGH);
          digitalWrite(led3, LOW);
        } else if(x == 1) {
          digitalWrite(led1, HIGH);
          digitalWrite(led2, LOW);
          digitalWrite(led2, LOW);
        } else if(x == 0) {
          digitalWrite(led1, LOW);
          digitalWrite(led2, LOW);
          digitalWrite(led3, LOW);
        }
      }
    }
  }

  pXValue = xValue;
  pYValue = yValue;
}