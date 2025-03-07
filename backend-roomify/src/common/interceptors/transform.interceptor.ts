import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  export interface Response<T> {
    data: T;
    meta?: any;
  }
  
  @Injectable()
  export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<Response<T>> {
      return next.handle().pipe(
        map(data => {
          // Verifica se a resposta já está em um formato especial
          if (data && data.data !== undefined) {
            return data;
          }
          
          // Adiciona informações de paginação se disponíveis
          if (data && Array.isArray(data) && data.length > 0 && data[0].meta) {
            const [items, meta] = data;
            return { data: items, meta };
          }
          
          // Formato padrão para respostas
          return { data };
        }),
      );
    }
  }