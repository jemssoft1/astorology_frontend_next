export interface APIParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

export interface APIResponseExample {
  status: string;
  description: string;
  payload: unknown;
}

export interface APIMethod {
  id: string;
  category: string;
  title: string;
  description: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  parameters: APIParameter[];
  requestExample?: unknown;
  responseExamples: APIResponseExample[];
  youtubeId?: string;
}

export interface APIDocMetadata {
  categories: string[];
  methods: APIMethod[];
}
