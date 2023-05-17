const TelegramBot = require('node-telegram-bot-api');

const express = require('express');
const cors = require('cors');

const token = '6063644412:AAENGNmI3Mh-RTeaFUj5jM12l9fsenSLekE';
const WebAppUrl = 'https://tg-bot-d412c.web.app';
const app = express();
const bot = new TelegramBot(token, {polling: true});
app.use(express.json());
app.use(cors());

//подсказки /...
bot.setMyCommands([
    {command: '/start', description: 'Hello'},
    {command: '/form', description: 'CallBack'}

])

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        console.log(msg.text);
        await bot.sendMessage(chatId, "Здравствуйте!\n" +
            "Мы ради приветствовать Вас в нашем новом боте!", {
            reply_markup: {
                inline_keyboard: [

                    [{text: 'Визитка', web_app: {url: WebAppUrl + '/main'}}],
                    [{text: 'Меню', web_app: {url: WebAppUrl + '/menu'}}],
                    [{text: 'Заполнить форму', web_app: {url: WebAppUrl + '/form'}}]

                ]
            }
        })
    }
    if(text === '/form') {
        console.log(msg.text);
        await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
            reply_markup: {
                keyboard: [
                    [{text: 'Заполнить форму', web_app: {url: WebAppUrl + '/form'}}],

                ]
            }
        })
    }


    if(msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)
            console.log(data)
            await bot.sendMessage(chatId, 'Спасибо за обратную связь!');
            // await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country);
            // await bot.sendMessage(chatId, 'Ваша улица: ' + data?.street);

            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
            }, 2000)
        } catch (e) {
            console.log(e);
        }
    }


});


app.post('/web-data', async (req, res) => {
    const {queryId, products = [], totalPrice} = req.body;
    try {
        await bot.sendMessage(queryId,
            // id: queryId,
            // title: 'Успешная покупка',
             'cool'
                // message_text: ` Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')}`

        )
        console.log("cool");
        return res.status(200).json("es");

    } catch (e) {
        console.log(e);
        return res.status(500).json("666");
    }
})

app.get('/buy/:id', async (req, res) => {
    /* парсим тело req (или скорее всего сам url) */
    console.log(req)
    await  bot.sendMessage(1035730958,
        // id: queryId,
        // title: 'Успешная покупка',
        'cool'
        // message_text: ` Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')}`

    )
    return res.status(200).json("es");
})

const PORT = 8080;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))




