

export interface HttpRequest {
  path: string;
  queryStringParams: Record<string, string>;
  body: string;
}