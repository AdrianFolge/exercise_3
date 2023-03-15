import request from 'supertest';
import app from '../server/app'

it("Test Invalid City Name", async () => {
    const response = await request(app).get("/weather/FakeCity");
    expect(response.statusCode).toBe(500);
  });

it("Test Negative Max Parameter", async () => {
    const response = await request(app).get("/weather?max=-1");
    expect(response.statusCode).toBe(400);
});

it("Test Zero Max Parameter", async () => {
    const response = await request(app).get("/weather?max=0");
    expect(response.statusCode).toBe(400);

});

it("Test Cache Expiry", async () => {
    // Klargjør cachen
    await request(app).get("/weather/London?clearCache=true");
  
    // Populer cachen 
    const response1 = await request(app).get("/weather/London");
    const body1 = response1.body
    expect(response1.statusCode).toBe(200);
    expect(body1.cityName).toBe('London');
    expect(body1.temperature).toBeDefined();
    expect(body1.weatherDescription).toBeDefined();
  
    // Venter i 5 minutter til cachen er slettet
    await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));
  
    // Cachen burde nå være tom
    const response2 = await request(app).get("/weather");
    const cityList = response2.body
    console.log(cityList)
    expect(cityList.some(city => cityName === 'London')).toBeFalsy();
  });

it("Test Concurrent Requests", async () => {
    // clear the cache for London
    await request(app).get("/weather/London?clearCache=true");
  
    // make multiple requests concurrently
    const requests = [
      request(app).get("/weather/London"),
      request(app).get("/weather/London"),
      request(app).get("/weather/London"),
    ];
  
    // wait for all requests to complete
    const responses = await Promise.all(requests);
  
    // assert that all responses are successful and have correct data
    responses.forEach(response => {
      expect(response.statusCode).toBe(200);
      expect(response.body.cityName).toBe('London');
      expect(response.body.temperature).toBeDefined();
      expect(response.body.weatherDescription).toBeDefined();
    });
  }, 10000);

jest.setTimeout(360000);