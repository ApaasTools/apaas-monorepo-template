/*
 * @Author: your name
 * @Date: 2020-07-17 15:51:37
 * @LastEditTime: 2021-04-16 17:18:25
 * @LastEditors: lizhihang
 * @Description: In User Settings Edit
 * @FilePath: \xdap-h5\src\simple-rule-engine.js
 */
import Vue from 'vue'
import { Assert, FunctionProxy } from 'x-lib-rule-engine'

const SimpleRuleEngine = {
  contextMethods: new Map(),
  registerContextMethod(functionName, ruleFunction) {
    if (ruleFunction.name === 'staticwrapper') {
      this.contextMethods.set(functionName, ruleFunction)
    } else {
      const functionProxy = new FunctionProxy()
      functionProxy.invoke = ruleFunction
      this.contextMethods.set(functionName, functionProxy)
    }
    return this
  },
  registerContextMethods(functions) {
    if (Array.isArray(functions)) {
      functions.forEach((RuleFunction) => {
        const fn = new RuleFunction()
        if (fn.name === 'staticwrapper') {
          this.contextMethods.set(fn.name, fn)
        } else {
          const functionProxy = new FunctionProxy()
          functionProxy.invoke = fn
          this.contextMethods.set(fn.name, functionProxy)
        }
      })
    }

    const simpleEqualFunction = {
      name: 'simpleEqual',
      getComponentValueSchema: {
        FORM_PEOPLE_SELECT: {
          returnType: 'string',
          formatterKeys: ['id']
        },
        FORM_DEPARTMENT_SELECT: {
          returnType: 'string',
          formatterKeys: ['id']
        },
        FORM_SELECT_INPUT: {
          returnType: 'string',
          formatterKeys: ['id'],
          configSchema: {
            primaryKey: 'id',
            valueKey: 'chooseOptions'
          }
        },
        FORM_RADIO_INPUT: {
          returnType: 'string',
          formatterKeys: ['id'],
          configSchema: {
            primaryKey: 'id',
            valueKey: 'chooseOptions'
          }
        },
        FORM_CHECKBOX_INPUT: {
          returnType: 'string',
          formatterKeys: ['id'],
          configSchema: {
            primaryKey: 'id',
            valueKey: 'chooseOptions'
          }
        },
        FORM_DATA_SELECTOR: {
          returnType: 'string',
          formatterKeys: ['name']
        }
      },
      mockFunction: (...args) => {},
      executeFunction: (...args) => {
        return args[0] === args[1]
      }
    }
    SimpleRuleEngine.registerContextMethod(simpleEqualFunction.name, simpleEqualFunction)

    const simpleIsContainsFunction = {
      name: 'simpleIsContains',
      getComponentValueSchema: {
        FORM_PEOPLE_SELECT: {
          returnType: 'string',
          formatterKeys: ['id']
        },
        FORM_DEPARTMENT_SELECT: {
          returnType: 'string',
          formatterKeys: ['id']
        },
        FORM_SELECT_INPUT: {
          returnType: 'string',
          formatterKeys: ['id'],
          configSchema: {
            primaryKey: 'id',
            valueKey: 'chooseOptions'
          }
        },
        FORM_RADIO_INPUT: {
          returnType: 'string',
          formatterKeys: ['id'],
          configSchema: {
            primaryKey: 'id',
            valueKey: 'chooseOptions'
          }
        },
        FORM_CHECKBOX_INPUT: {
          returnType: 'string',
          formatterKeys: ['id'],
          configSchema: {
            primaryKey: 'id',
            valueKey: 'chooseOptions'
          }
        },
        FORM_DATA_SELECTOR: {
          returnType: 'string',
          formatterKeys: ['name']
        }
      },
      mockFunction: (...args) => {
        Assert.argsRangeLength(args, { min: 1 })
      },
      executeFunction: (...args) => {
        Assert.argsRangeLength(args, { min: 1 })
        if (typeof args[1] !== 'undefined' && args[1] !== null) {
          if (Array.isArray(args[0])) {
            return args[0].indexOf(args[1]) > -1
          } else {
            return String(args[0]).indexOf(args[1]) > -1
          }
        }
        return true
      }
    }
    SimpleRuleEngine.registerContextMethod(simpleIsContainsFunction.name, simpleIsContainsFunction)

    return this
  },
  parseRuleToExpr: (simpleRuleConfig) => {
    // 执行解析，根据不同的类型解析，根据不同的解析拼装字符串
    const formFieldRuleList = simpleRuleConfig.formFieldRuleList
    // 递归生成表达式
    let ruleExpr = ''
    if (Array.isArray(formFieldRuleList)) {
      formFieldRuleList.forEach((group, i) => {
        if (i > 0) {
          ruleExpr += ` || `
        }
        if (Array.isArray(group.fieldRuleList)) {
          for (let j = 0; j < group.fieldRuleList.length; j++) {
            const ruleElement = group.fieldRuleList[j]
            if (j > 0) {
              ruleExpr += ` && `
            }
            if (ruleElement.type === 'number') {
              if (ruleElement.op === 'eq') {
                ruleExpr += ` ( ruleContext.simpleEqual(ruleContext.staticwrapper( ruleContext.getComponent('${ruleElement.uuid}'), ${ruleElement.values[0]}) )) `
              } else if (ruleElement.op === 'notEq') {
                ruleExpr += ` ( ruleContext.xdapnot(( ruleContext.simpleEqual(ruleContext.staticwrapper( ruleContext.getComponent('${ruleElement.uuid}'), ${ruleElement.values[0]}) )) ) `
              } else if (ruleElement.op === 'gt') {
                ruleExpr += ` ( ruleContext.staticwrapper( ruleContext.getComponent('${ruleElement.uuid}') ) > ${ruleElement.values[0]} ) `
              } else if (ruleElement.op === 'ge') {
                ruleExpr += ` ( ruleContext.staticwrapper( ruleContext.getComponent('${ruleElement.uuid}') ) >= ${ruleElement.values[0]} ) `
              } else if (ruleElement.op === 'lt') {
                ruleExpr += ` ( ruleContext.staticwrapper( ruleContext.getComponent('${ruleElement.uuid}') ) < ${ruleElement.values[0]} ) `
              } else if (ruleElement.op === 'le') {
                ruleExpr += ` ( ruleContext.staticwrapper( ruleContext.getComponent('${ruleElement.uuid}') ) <= ${ruleElement.values[0]} ) `
              } else if (ruleElement.op === 'in') {
                ruleExpr += ` ( ruleContext.staticwrapper( ruleContext.getComponent('${ruleElement.uuid}') ) >= ${ruleElement.values[0]} && ruleContext.staticwrapper( ruleContext.getComponent('${ruleElement.uuid}') ) <= ${ruleElement.values[1]} ) `
              } else if (ruleElement.op === 'notIn') {
                ruleExpr += ` !( ruleContext.staticwrapper( ruleContext.getComponent('${ruleElement.uuid}') ) >= ${ruleElement.values[0]} && ruleContext.staticwrapper( ruleContext.getComponent('${ruleElement.uuid}') ) <= ${ruleElement.values[1]} ) `
              }
            } else if (ruleElement.type === 'string') {
              let valueStr
              let isFunc = false // 如果是执行函数，则不需要拼引号
              if (ruleElement.values[0] === 'currentDept') {
                valueStr = ` ruleContext.getCurrentDept() `
                isFunc = true
              } else if (ruleElement.values[0] === 'currentUser') {
                valueStr = ` ruleContext.getCurrentUser() `
                isFunc = true
              } else if (ruleElement.values[0] === 'appointDept') {
                valueStr = ruleElement.values[1]
              } else if (ruleElement.values[0] === 'appointUser') {
                valueStr = ruleElement.values[1]
              } else {
                valueStr = ruleElement.values[0]
              }
              if (ruleElement.op === 'eq') {
                if (isFunc) {
                  ruleExpr += ` ( ruleContext.simpleEqual(ruleContext.getComponent('${ruleElement.uuid}'), ${valueStr})) `
                } else {
                  ruleExpr += ` ( ruleContext.simpleEqual(ruleContext.getComponent('${ruleElement.uuid}'), '${valueStr}')) `
                }
              } else if (ruleElement.op === 'notEq') {
                if (isFunc) {
                  ruleExpr += ` ( ruleContext.xdapnot( ruleContext.simpleEqual(ruleContext.getComponent('${ruleElement.uuid}'), ${valueStr})) ) `
                } else {
                  ruleExpr += ` ( ruleContext.xdapnot( ruleContext.simpleEqual(ruleContext.getComponent('${ruleElement.uuid}'), '${valueStr}')) ) `
                }
              } else if (ruleElement.op === 'in') {
                if (isFunc) {
                  ruleExpr += ` ( ruleContext.simpleIsContains(ruleContext.getComponent('${ruleElement.uuid}'), ${valueStr})) `
                } else {
                  ruleExpr += ` ( ruleContext.simpleIsContains(ruleContext.getComponent('${ruleElement.uuid}'), '${valueStr}')) `
                }
              } else if (ruleElement.op === 'notIn') {
                if (isFunc) {
                  ruleExpr += ` !( ruleContext.simpleIsContains(ruleContext.getComponent('${ruleElement.uuid}'), ${valueStr})) `
                } else {
                  ruleExpr += ` !( ruleContext.simpleIsContains(ruleContext.getComponent('${ruleElement.uuid}'), '${valueStr}')) `
                }
              } else if (ruleElement.op === 'startWith') {
                if (isFunc) {
                  ruleExpr += ` ( ruleContext.xdapstartswith(ruleContext.getComponent('${ruleElement.uuid}'), ${valueStr})) `
                } else {
                  ruleExpr += ` ( ruleContext.xdapstartswith(ruleContext.getComponent('${ruleElement.uuid}'), '${valueStr}')) `
                }
              } else if (ruleElement.op === 'endWith') {
                if (isFunc) {
                  ruleExpr += ` ( ruleContext.xdapendswith(ruleContext.getComponent('${ruleElement.uuid}'), ${valueStr})) `
                } else {
                  ruleExpr += ` ( ruleContext.xdapendswith(ruleContext.getComponent('${ruleElement.uuid}'), '${valueStr}')) `
                }
              } else if (ruleElement.op === 'isNull') {
                ruleExpr += ` ( ruleContext.xdapisempty ( ruleContext.getComponent('${ruleElement.uuid}') ) ) `
              } else if (ruleElement.op === 'isNotNull') {
                ruleExpr += ` !( ruleContext.xdapisempty ( ruleContext.getComponent('${ruleElement.uuid}') ) )`
              }
            } else if (ruleElement.type === 'date') {
              let dateValueStr
              if (ruleElement.values[0] === 'today') {
                dateValueStr = Vue.prototype.$dayjs().format('YYYY-MM-DD')
              } else if (ruleElement.values[0] === 'yesterday') {
                dateValueStr = Vue.prototype
                  .$dayjs()
                  .add(-1, 'day')
                  .format('YYYY-MM-DD')
              } else if (ruleElement.values[0] === 'tomorrow') {
                dateValueStr = Vue.prototype
                  .$dayjs()
                  .add(1, 'day')
                  .format('YYYY-MM-DD')
              } else if (ruleElement.values[0] === 'afterFewDay') {
                dateValueStr = Vue.prototype
                  .$dayjs()
                  .add(ruleElement.values[1], 'day')
                  .format('YYYY-MM-DD')
              } else if (ruleElement.values[0] === 'beforeFewDay') {
                dateValueStr = Vue.prototype
                  .$dayjs()
                  .add(-ruleElement.values[1], 'day')
                  .format('YYYY-MM-DD')
              } else if (ruleElement.values[0] === 'appointTime') {
                dateValueStr = ruleElement.values[1]
              }

              if (ruleElement.op === 'eq') {
                ruleExpr += ` ( ruleContext.dayjs(ruleContext.getComponentValue('${ruleElement.uuid}') ? ruleContext.getComponentValue('${ruleElement.uuid}') : '1900-01-01').format('YYYY-MM-DD') == '${dateValueStr}' ) `
              } else if (ruleElement.op === 'notEq') {
                ruleExpr += ` ( ruleContext.xdapnot( ruleContext.dayjs(ruleContext.getComponentValue('${ruleElement.uuid}') ? ruleContext.getComponentValue('${ruleElement.uuid}') : '1900-01-01').format('YYYY-MM-DD') != '${dateValueStr}' ) ) `
              } else if (ruleElement.op === 'before') {
                ruleExpr += ` ( ruleContext.dayjs(ruleContext.getComponentValue('${ruleElement.uuid}') ? ruleContext.getComponentValue('${ruleElement.uuid}') : '1900-01-01').isBefore(ruleContext.dayjs('${dateValueStr}')) ) `
              } else if (ruleElement.op === 'after') {
                ruleExpr += ` ( ruleContext.dayjs(ruleContext.getComponentValue('${ruleElement.uuid}') ? ruleContext.getComponentValue('${ruleElement.uuid}') : '1900-01-01').isAfter(ruleContext.dayjs('${dateValueStr}')) ) `
              } else if (ruleElement.op === 'in') {
                ruleExpr += ` ( ruleContext.dayjs(ruleContext.getComponentValue('${ruleElement.uuid}') ? ruleContext.getComponentValue('${ruleElement.uuid}') : '1900-01-01') >= ruleContext.dayjs('${ruleElement.values[0]}') && ruleContext.dayjs(ruleContext.getComponentValue('${ruleElement.uuid}') ? ruleContext.getComponentValue('${ruleElement.uuid}') : '1900-01-01') <= ruleContext.dayjs('${ruleElement.values[1]}') ) `
              } else if (ruleElement.op === 'notIn') {
                ruleExpr += ` !( ruleContext.dayjs(ruleContext.getComponentValue('${ruleElement.uuid}') ? ruleContext.getComponentValue('${ruleElement.uuid}') : '1900-01-01') >= ruleContext.dayjs('${ruleElement.values[0]}') && ruleContext.dayjs(ruleContext.getComponentValue('${ruleElement.uuid}') ? ruleContext.getComponentValue('${ruleElement.uuid}') : '1900-01-01') <= ruleContext.dayjs('${ruleElement.values[1]}') ) `
              } else if (ruleElement.op === 'isNull') {
                ruleExpr += ` ( ruleContext.xdapisempty ( ruleContext.getComponentValue('${ruleElement.uuid}') ) ) `
              } else if (ruleElement.op === 'isNotNull') {
                ruleExpr += ` !( ruleContext.xdapisempty ( ruleContext.getComponentValue('${ruleElement.uuid}') ) )`
              }
            }
          }
        }
      })
    }
    return ruleExpr
  },
  executeRule: (simpleRuleConfig) => {
    const ruleContext = new RuleRuntimeContext()

    if (!simpleRuleConfig) {
      return true
    }

    const ruleExpr = SimpleRuleEngine.parseRuleToExpr(simpleRuleConfig)
    if (!ruleExpr || ruleExpr === '') {
      return
    }
    const funcBody = `const window = undefined; const document = undefined; return (${ruleExpr})`

    /* eslint-disable */
    const ruleExecutorFunc = new Function('ruleContext', funcBody)

    try {
      let result = ruleExecutorFunc(ruleContext)
      result =
        typeof result === 'object' && typeof result.next === 'function'
          ? result.next().value
          : result
      return result
    } catch (error) {
      console.error(error)
      return false
    }
  }
}

function RuleRuntimeContext() {
  SimpleRuleEngine.contextMethods.forEach((ruleFunction, key) => {
    this[key] = (...args) => {
      return ruleFunction.executeFunction(...args)
    }
  })
}

export { SimpleRuleEngine }
