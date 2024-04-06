import MockAdapter from "axios-mock-adapter"
import axios from "axios"

import { startServMockAuth } from "./auth.mock"
import { startServMockTask } from "./task.mock"

export const startServiceMock = () => {
  const mock = new MockAdapter(axios, { delayResponse: 300 });

  startServMockAuth(mock)
  startServMockTask(mock)
}
