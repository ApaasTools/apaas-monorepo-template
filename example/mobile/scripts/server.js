const express = require('express')
const path = require('path')
const { spawn } = require('child_process')
const net = require('net')
const chokidar = require('chokidar')
const cors = require('cors')
const fs = require('fs')

const app = express()
const initialPort = 3000
const maxPort = 65535

const [, , customModule, ...argv] = process.argv
const STATIC_DIR = path.join(process.cwd(), customModule)

app.use(cors())
app.use(express.static(STATIC_DIR))

const clients = new Set()

app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  })

  req.on('close', () => {
    clients.delete(res)
    console.log(`\x1b[31m【SSE】\x1b[0m 客户端断开连接`)
  })

  clients.add(res)
  console.log(`\x1b[34m【SSE】\x1b[0m 新的客户端连接`)
})

function startBuild() {
  const customModulePath = path.resolve(`${process.cwd()}`, 'src/custom', customModule)
  const customModuleConfigPath = path.resolve(customModulePath, 'apaas.json')
  const apaasConfig = JSON.parse(fs.readFileSync(customModuleConfigPath))
  const customModuleEntryPath = path.resolve(customModulePath, apaasConfig.entry)

  process.env.PUBLIC_OUTPUT_NAME = customModule
  process.env.PUBLIC_ENTRY = customModuleEntryPath

  const buildProcess = spawn('npx', ['rslib', 'build', '-w', ...argv])

  buildProcess.stdout.on('data', (data) => {
    const result = data.toString().trim()
    console.log(`\x1b[36m【源代码更新】\x1b[0m ${result}`)
  })

  buildProcess.stderr.on('data', (data) => {
    console.error(`rslib错误: ${data.toString().trim()}`)
  })

  buildProcess.on('close', (code) => {
    console.log(`\x1b[31m【rslib】\x1b[0m 进程已退出，退出码: ${code}`)
  })

  return buildProcess
}

// 递归检查端口
function checkPort(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        const nextPort = port + 1
        if (nextPort > maxPort) {
          reject(new Error(`从 ${initialPort} 到 ${maxPort} 的端口都被占用`))
        } else {
          resolve(checkPort(nextPort))
        }
      } else {
        reject(err)
      }
    })
    server.once('listening', () => {
      server.close(() => {
        resolve(port)
      })
    })
    server.listen(port, '127.0.0.1')
  })
}

// 监听打包后的产物目录
function watchBuildOutput() {
  const watcher = chokidar.watch(STATIC_DIR, {
    ignored: /(^|[/\\])\../,
    persistent: true,
    ignoreInitial: true
  })

  console.log(`\x1b[32m【正在监听打包产物目录】\x1b[0m ${STATIC_DIR}`)

  watcher.on('all', (event, filePath) => {
    const relativePath = path.relative(process.cwd(), filePath)
    if (event === 'change') {
      console.log(`\x1b[32m【打包产物变化】\x1b[0m ${relativePath}`)
      clients.forEach((client) => {
        console.log(`\x1b[35m【SSE】\x1b[0m 发送消息通知客户端刷新`)
        client.write(
          `data: ${JSON.stringify({
            event,
            filePath: relativePath?.split('\\').pop()
          })}\n\n`
        )
      })
    }
  })

  watcher.on('error', (error) => {
    console.error(`文件监听错误: ${error}`)
  })

  process.on('SIGINT', () => {
    watcher.close()
    process.exit()
  })
}

async function startServer() {
  try {
    const port = await checkPort(initialPort)

    app.listen(port, () => {
      console.log(`\x1b[32m【静态资源服务器】\x1b[0m http://127.0.0.1:${port}/`)
      console.log(`\x1b[32m【静态资源目录】\x1b[0m ${STATIC_DIR}`)
      startBuild()
      watchBuildOutput()
    })
  } catch (err) {
    console.error(`无法找到可用端口: ${err.message}`)
    process.exit(1)
  }
}

startServer()
