import http from "k6/http";
import { check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export let options = {
  stages: [
    { duration: "1m", target: 50 },
    { duration: "3m", target: 200 },
    { duration: "1m", target: 10 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],
  },
};

function makeRequestToURL(url) {
  let response = http.get(url);
  check(response, {
    "status is 200": (r) => r.status === 200,
  });
}

export default function () {
  makeRequestToURL("http://localhost:8080/custom");
  makeRequestToURL("http://localhost:8080/api/v1/users/1");
}

export function handleSummary(data) {
  return {
    "benchmark/index.html": htmlReport(data), //the default data object
  };
}
