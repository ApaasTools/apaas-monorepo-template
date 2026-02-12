/**
 * 捕获异常埋点
 * @param {Promise} promise  $request promise 对象
 * @returns
 */
export async function trackRequestError(promise) {
  try {
    return new Promise((resolve) => {
      promise
        .asyncThen(
          (res) => resolve([res, null]),
          (err) => resolve([null, err])
        )
        .aysncErrorCatch((err) => resolve([null, err]))
    })
  } catch (error) {
    return [null, error]
  }
}
