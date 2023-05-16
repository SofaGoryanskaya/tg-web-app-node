const TelegramBot = require('node-telegram-bot-api');

const express = require('express');
const cors = require('cors');

const token = '6132392940:AAG3R5s1IK6HfOgBk2FzWNbWttXyQnWzBq0';
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

                    [{text: 'Профиль', web_app: {url: WebAppUrl + '/prof'}}],
                    [{text: 'Корзина', web_app: {url: WebAppUrl}}],
                ]
            }
        })
    }
    if(text === '/form') {
        await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
        reply_markup: {
            keyboard: [
                [{text: 'Меню', web_app: {url: WebAppUrl + '/menu'}}]

            ]
        }
    })
    }

    if(msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)
            console.log(data)
            await bot.sendMessage(chatId, 'Спасибо за обратную связь!')
            await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country);
            await bot.sendMessage(chatId, 'Ваша улица: ' + data?.street);

            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
            }, 2000)
        } catch (e) {
            console.log(e);
        }
    }

});


app.post('/web-data', async (req, res) => {
    const {queryId} = req.body;
    console.log(req.body);
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {
                message_text: 'cool'
                // message_text: ` Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')}`
            }
        })
        console.log("cool");
        return res.status(200).json("es");

    } catch (e) {
        console.log(e);
        return res.status(500).json("666");
    }
})

const PORT = 8080;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))




