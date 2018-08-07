#include <Bridge.h>
#include <HttpClient.h>

const int buttonPin = 8;

const int rPin = 9;
const int gPin = 10;
const int bPin = 11;

int btnState = 0;
int coolTime = 100;

float cr = 0;
float cg = 0;
float cb = 0;

float tr = 0;
float tg = 0;
float tb = 0;

int cols [5][3] = {{255,160,100}, {130,220,220}, 
{160,225,100}, {240,220,105}, {240,220,105}};

void setup() {
  pinMode(buttonPin, INPUT);

  Bridge.begin();
  Serial.begin(9600);
}

void loop() {
  HttpClient client;
  
  int cBtnState = digitalRead(buttonPin);
  if(btnState == 0 && cBtnState == 1 && coolTime < 0) {
    int r = random(2);
    cr = cols[r][0];
    cg = cols[r][1];
    cb = cols[r][2];
    coolTime = 100;

    Serial.println(r);
    // get
    client.get("https://tkyk-ysk-0916.herokuapp.com/balloon?t="+(r+1));
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

  delay(10);
}


