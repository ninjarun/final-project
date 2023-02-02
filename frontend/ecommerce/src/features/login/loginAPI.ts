import axios from "axios";
import {SERVER} from "../../globalVar"

export function userFetch(creds:any) {
    return new Promise<{ data: any }>((resolve) =>
      axios
        .post(SERVER+ "login", { username:creds.username, password:creds.password })
        .then((res) => resolve({ data: res.data }))
    );
  }
  
  export function refreshUser(refresh:any) {
    return new Promise<{ data: any }>((resolve) =>
      axios
        .post(SERVER+ "refresh", { refresh })
        .then((res) => resolve({ data: res.data }))
    );
  }
