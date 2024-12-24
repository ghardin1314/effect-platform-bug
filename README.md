
# Effect Platform `toWebHandler` Bug

To reproduce:

1. install `npm install`
2. run `npm run dev`
3. navigate to `http://localhost:3000/api` or `http://localhost:3000/api/foo`
4. see the error

```
 ⨯ TypeError: context.unsafeMap is not iterable
    at new Promise (<anonymous>)
 ⨯ TypeError: context.unsafeMap is not iterable
    at new Promise (<anonymous>)
```