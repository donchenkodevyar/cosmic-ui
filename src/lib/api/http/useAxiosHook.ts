import React from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_API_ENDPOINT_DEVELOPMENT : process.env.REACT_APP_API_ENDPOINT_PRODUCTION;

const getHeaders = (params?: Object, token?: string, cancelToken?: any) => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? 'Bearer ' + token : '',
      // 'Accept-Language': language,
    },
    cancelToken: cancelToken,
    params: params || null,
  };
};

interface IApiRes<T> {
  response: T;
  error: AxiosError;
  loading: boolean;
  onGet?: (url: string, param?: any, token?: string) => void;
  onGetChainData?: (url: string[], keys: string[], param?: any, token?: string) => void;
  onPost?: (url: string, _data: any, param?: any, token?: string) => void;
  onPut?: (url: string, _data: any, param?: any, token?: string) => void;
  onDelete?: (url: string, param?: any, token?: string) => void;
}

export const useGet = <T = any>(): IApiRes<T> => {
  const [response, setResponse] = React.useState<T>(null);
  const [error, setError] = React.useState<AxiosError>(null);
  const [loading, setloading] = React.useState<boolean>(false);

  const onGet = React.useCallback((url: string, param?: any, token?: string) => {
    let source = axios.CancelToken.source();
    setloading(true);
    setError(null);
    getDataAsync(url, param, token, source.token);
    return () => {
      source.cancel('Cancelling in cleanup');
    };
  }, []);

  const getDataAsync = async (url: string, param?: any, token?: string, cancelToken?: any) => {
    const _header = getHeaders(param, token, cancelToken);
    await axios
      .get(url, _header)
      .then((res: AxiosResponse<T>) => {
        setResponse(res.data);
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data);
          return;
        }
        setError(err.toJSON());
      })
      .finally(() => {
        setloading(false);
      });
  };

  return { response, error, loading, onGet };
};

export const usePost = <T = any, R = any>(): IApiRes<R> => {
  const [response, setResponse] = React.useState<R>(null);
  const [error, setError] = React.useState<AxiosError>(null);
  const [loading, setloading] = React.useState<boolean>(false);

  const onPost = React.useCallback((url: string, _data: T, param?: any, token?: string) => {
    setloading(true);
    postDataAsync(url, _data, param, token);
  }, []);

  const postDataAsync = async (url: string, _data: T, param?: any, token?: string) => {
    const _header = getHeaders(param, token);
    const data = JSON.stringify(_data);
    await axios
      .post(url, data, _header)
      .then((res: AxiosResponse<R>) => {
        setResponse(res.data);
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data);
          return;
        }
        setError(err.toJSON());
      })
      .finally(() => {
        setloading(false);
      });
  };

  return { response, error, loading, onPost };
};

export const usePut = <T = any, R = any>(): IApiRes<R> => {
  const [response, setResponse] = React.useState<R>(null);
  const [error, setError] = React.useState<AxiosError>(null);
  const [loading, setloading] = React.useState<boolean>(false);

  const onPut = React.useCallback((url: string, _data: T, param?: any, token?: string) => {
    setloading(true);
    putDataAsync(url, _data, param, token);
  }, []);

  const putDataAsync = async (url: string, _data: T, param?: any, token?: string) => {
    const _header = getHeaders(param, token);
    const data = JSON.stringify(_data);
    await axios
      .put(url, data, _header)
      .then((res: AxiosResponse<R>) => {
        setResponse(res.data);
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data);
          return;
        }
        setError(err.toJSON());
      })
      .finally(() => {
        setloading(false);
      });
  };

  return { response, error, loading, onPut };
};

export const useDelete = <T = any>(): IApiRes<T> => {
  const [response, setResponse] = React.useState<T>(null);
  const [error, setError] = React.useState<AxiosError>(null);
  const [loading, setloading] = React.useState<boolean>(false);

  const onDelete = React.useCallback((url: string, param?: any, token?: string) => {
    setloading(true);
    deleteDataAsync(url, param, token);
  }, []);

  const deleteDataAsync = async (url: string, param?: any, token?: string) => {
    const _header = getHeaders(param, token);
    await axios
      .delete(url, _header)
      .then((res: AxiosResponse) => {
        setResponse(res.data);
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data);
          return;
        }
        setError(err.toJSON());
      })
      .finally(() => {
        setloading(false);
      });
  };

  return { response, error, loading, onDelete };
};

export const useGetTopology = <T = any>(): IApiRes<T> => {
  const [response, setResponse] = React.useState<T>(null);
  const [error, setError] = React.useState<AxiosError>(null);
  const [loading, setloading] = React.useState<boolean>(false);

  const onGetChainData = React.useCallback((url: string[], keys: string[], param?: any, token?: string) => {
    setloading(true);
    setError(null);
    getDataAsync(url, keys, param, token);
  }, []);

  const getDataAsync = async (url: string[], keys: string[], param?: any, token?: string) => {
    const _header = getHeaders(param, token);
    await axios
      .all([axios.get(url[0], _header), axios.get(url[1], _header)])
      .then((res: AxiosResponse<any>[]) => {
        const _obj: any = {};
        keys.forEach((key, i) => {
          _obj[key] = res[i].data;
        });
        setResponse(_obj);
      })
      .catch((err: AxiosError | AxiosError[]) => {
        if (Array.isArray(err)) {
          const _obj: any = {};
          keys.forEach((key, i) => {
            if (err[i].response && err[i].response.data && err[i].response.data.message) {
              _obj[key] = err[i].response.data;
              return;
            }
            _obj[key] = err[i].toJSON();
          });
          setError(_obj);
          return;
        }
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data);
          return;
        }
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  return { response, error, loading, onGetChainData };
};
