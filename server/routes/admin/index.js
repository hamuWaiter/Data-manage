
module.exports = app => {

    const assert = require("http-assert")

    const jwt = require("jsonwebtoken")
    // jsonwebtoken用于返回用户数据以及权限验证
    const express = require("express")
    //后端路由
    const router = express.Router({
        // 合并 url参数,可以使用在app.use中定义的resource参数，
        // 不然获取不到resource（父级参数）
        mergeParams: true
    })

    // 分类接口
    router.post("/", async (req, res) => {

        // 创建一条文档，内容是客户端发送过来的req.body
        // 要想使用req.body前面要加上await
        const model = await req.Model.create(req.body)                           //增
        res.send(model)
    })


    router.put("/:id", async (req, res) => {
        // 创建一条文档，内容是客户端发送过来的req.body
        // 要想使用req.body前面要加上await
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)  //改
        res.send(model)
    })


    router.delete("/:id", async (req, res) => {
        // 创建一条文档，内容是客户端发送过来的req.body
        // 要想使用req.body前面要加上await
        await req.Model.findByIdAndDelete(req.params.id, req.body)                //删
        res.send({
            success: true
        })
    })
    // 分类列表接口
    router.get("/", async (req, res) => {
        // 创建一条文档，内容是客户端发送过来的req.body
        // 要想使用req.body前面要加上await
        // 查找数据，限制一次10条

        // 通过populate方法可以将关联字段parent的完整信息返回到客服端
        // 如果不加，返回的数据直接就是关联父级的_id，而没有其所关联的父级
        // 的名称等信息
        let queryOptions = {}
        if (req.Model.modelName === "Category") {
            // 表示只有Category集合需要提取parent关联字段，
            // 其他如果没有此字段的集合就不用提取了
            queryOptions.populate = "parent"
        }
        const items = await req.Model.find().setOptions(queryOptions).limit(10)     //查
        res.send(items)
    })


    // 编辑分类接口
    router.get("/:id", async (req, res) => {
        // 创建一条文档，内容是客户端发送过来的req.body
        // 要想使用req.body前面要加上await
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })


// 用户校验中间件
    const authMid = async (req, res, next) => {
        // 权限验证中间件
        // 获取客户端传入的token数据,
        // 并将其以空格分隔开取后面的字段以获取正确的token 
        const token = String(req.headers.authorization || "").split(" ").pop()
        if(!token){  //如果找不到用户
            return res.status(401).send({
                message:"请登录"
            })
        }

        // 验证token，（verify返回的是boolean数据）
        // id是当初在返回给客户端是保存的用户id，{id}表示取出id
        const { id } = jwt.verify(token, app.get('secret'))
        if(!id){  //如果找不到用户
            return res.status(401).send({
                message:"请登录"
            })
        }

        // 通过id在数据库中查找用户并挂载到req上，这样在所有请求中
        // 都可以用req.user访问信息
        req.user = await require("../../models/User").findById(id)
        if(!req.user){  //如果找不到用户
            return res.status(401).send({
                message:"请登录"
            })
        }
        await next()
    }
// 获取模型中间件
    const modelMid = async (req, res, next) => { //这个函数叫做中间件，有三个参数，post请求也有第三个参数但是一般用不着

        // 由于一个路径对应请求函数（post、get、put、delete）很多，
        // 所以在请求数据之前先进行这一步处理得到集合，然后在请求函数中通过req.Model访问这个集合
        // 而不用在没个请求函数中都定义如下两句话


        // inflection可以将小写开头复数形式的单词改为大写开头单数形式
        const modelName = require("inflection").classify(req.params.resource)
        // 在请求对象上面挂载一个Model属性，在post/get中就可以通过req.Model访问
        req.Model = require("../../models/" + modelName)
        // next()表示开始处理具体请求（post/get....）
        next()

    }


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 通用增删改查接口 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

    app.use("/admin/api/rest/:resource",authMid,modelMid, router)  //挂载子路由


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 上传图片接口 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    //1.使用multer中间件将上传的图片保存到服务器的某个文件夹下去

    const multer = require("multer")
    const upload = multer({
        // dest表示将图片 保存到哪一个文件夹下去
        // __dirname表示项目的系统根路径，后面的是项目内的相对地址
        dest: __dirname + '/../../uploads'
    })



    // upload.single("file")表示接口可以接收单个文件，
    app.post("/admin/api/upload",authMid,upload.single("file"), async (req, res) => {
        //将文件名返回回去 
        const file = req.file
        // 手动拼接触一个图片URL 地址并挂到file中返回給客户端
        file.url = "http://localhost:3000/uploads/" + file.filename
        // express中并没有req.file，由于使用了中间件express才能使用req.file
        res.write
        res.send(file)

    })

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 登录接口 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    app.post("/admin/api/login", async (req, res) => {


        const { username, password } = req.body
        // 1.查找用户,并将加密后的密文取出来
        const user = await require("../../models/User").findOne({ username: username }).select('+password')

        if(!user){  //如果找不到用户
            return res.status(422).send({
                message:"用户不存在！"
            })
        }

        //2.密码验证    
        const isRight = require("bcrypt").compareSync(password, user.password)
        if(!isRight){
            // 密码错误
            return res.status(422).send({
                message:"密码错误！"
            })
        }

        //3.返回token

        // app.get("secret")是秘钥，其中secret是在index.js中全局挂载的属性
        // 所以可以在server的任何地方使用app.get获取其值
        const token = jwt.sign({ id: user._id }, app.get("secret"))

        // 返回token
        res.send({ token })

    })
}

