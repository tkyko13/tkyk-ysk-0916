#include <Bridge.h>
#include <HttpClient.h>

//#include <Process.h>

const int buttonPin = 8;

const int rPin = 9;
const int gPin = 11;
const int bPin = 10;

int btnState = 0;
int coolTime = 30;

float cr = 0;
float cg = 0;
float cb = 0;

float tr = 0;
float tg = 0;
float tb = 0;

int cols [5][3] = {{255,160,100}, {130,220,220}, 
{160,225,100}, {240,220,105}, {220,200,240}};

HttpClient client;

void setup() {
  pinMode(buttonPin, INPUT);

  Bridge.begin();
  SerialUSB.begin(9600);
}

void loop() {
//  Process wifiCheck;
//  wifiCheck.runShellCommand("/usr/bin/pretty-wifi-info.lua");
//  while (wifiCheck.available() > 0) {
//    char c = wifiCheck.read();
//    SerialUSB.print(c);
//  }
  
  
  
  int cBtnState = digitalRead(buttonPin);
  if(btnState == 0 && cBtnState == 1 && coolTime < 0) {
    int r = random(5);
    cr = cols[r][0];
    cg = cols[r][1];
    cb = cols[r][2];
    coolTime = 30;

    analogWrite(rPin, cr);
    analogWrite(gPin, cg);
    analogWrite(bPin, cb);

    String reqUrl = "http://tkyk-ysk-0916.herokuapp.com/balloon?t=";
    reqUrl += String(r+1);
    SerialUSB.println(reqUrl);
    // get
    client.get(reqUrl);
    SerialUSB.println("get comp!");
  }
  coolTime --;
  btnState = cBtnState;
  
  cr += (tr - cr) / 50;
  cg += (tg - cg) / 50;
  cb += (tb - cb) / 50;

//  Serial.println(cr);
  analogWrite(rPin, cr);
  analogWrite(gPin, cg);
  analogWrite(bPin, cb);

  delay(15);
}


