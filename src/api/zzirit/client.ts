import { DefaultApi, PaymentsApi } from "./apis";
import { APIApi } from "./apis/APIApi";
import { Configuration } from "./runtime";

const config = new Configuration({
  credentials: "include",
});

class Client {
  auth: DefaultApi;
  api: APIApi;
  payments: PaymentsApi;

  constructor(config: Configuration) {
    this.auth = new DefaultApi(config);
    this.api = new APIApi(config);
    this.payments = new PaymentsApi(config);
  }
}

export const client = new Client(config);
