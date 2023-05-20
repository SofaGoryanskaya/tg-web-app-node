const TelegramBot = require('node-telegram-bot-api');

const express = require('express');
const cors = require('cors');

const token = '6279893415:AAEGEFObYlSgdfW8z5rpKoIXxuoPgGn2qBY';
const WebAppUrl = 'https://tg-bot-2-a0669.web.app';
const app = express();
const bot = new TelegramBot(token, {polling: true});
app.use(express.json());
app.use(cors());

//подсказки /...
bot.setMyCommands([
    {command: '/start', description: 'Приветствие'},
    {command: '/menu', description: 'Главное меню'},
    {command: '/businessCard', description: 'Визитка кофейни'},
    {command: '/order', description: 'Оформить заказ'},
    {command: '/contacts', description: 'Оформить заказ'}
])

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        console.log(msg.text);
        await bot.sendMessage(chatId, "Здравствуйте!\n" +
            "Мы ради приветствовать Вас в нашем новом боте!\n Выберите интересуюший для вас раздел: ", {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Визитка', web_app: {url: WebAppUrl + '/main'}}],
                    [{text: 'Оформить заказ - прототип для приложения', web_app: {url: WebAppUrl + '/checkF'}}],
                    [{text: 'Меню', web_app: {url: WebAppUrl + '/menu'}}],
                    [{text: 'Наши контакты', web_app: {url: WebAppUrl + '/map'}}],
                    // [{text: 'для проверки', web_app: {url: WebAppUrl + '/prof'}}]
                ]
            }
        })
        setTimeout(async () => {
            await bot.sendMessage(chatId, "Для оформления пропишите команду: /order");
        }, 500)
    }

    if (text === '/menu') {
        console.log(msg.text);
        await bot.sendMessage(chatId, "Актуальное меню на данный момент", {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Меню', web_app: {url: WebAppUrl + '/menu'}}]
                ]
            }
        })
    }
    if(text === '/order') {
        console.log(msg.text);
        await bot.sendMessage(chatId, 'Приятных покупок' + '\n' +
            "Ниже появится кнопка для оформления заказа", {
            reply_markup: {
                keyboard: [
                    [{text: 'Оформить заказ', web_app: {url: WebAppUrl + '/form'}}],
                ]
            }
        })
    } if(text === '/business_card') {
        console.log(msg.text);
        await bot.sendMessage(chatId, 'Визитка нашей кофейни' + '\n' +
            "Кофе — лучшая когда-либо созданная органическая смесь." + '\n' +
            " –  Звёздный Путь, Вояджер\n", {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Визитка', web_app: {url: WebAppUrl + '/main'}}],
                ]
            }
        })
    } if(text === '/contacts') {
        console.log(msg.text);
        await bot.sendMessage(chatId, 'Мы всегда будем рады Вас видеть: ', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Наши контакты', web_app: {url: WebAppUrl + '/map'}}],
                ]
            }
        })
    }



    if(msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)
            console.log(data)
            await bot.sendMessage(chatId, 'Ваш заказ принят. Спасибо, что выбераете нас!');
            await bot.sendMessage(chatId, "Номер заказа: № " + data?.numberOrder +  '\n' +
                'Телефон: ' + data?.number + '\n' +
                'Оплата: ' + data?.subjectTWO + '\n' +
                'Способ получения: ' + data?.subjectONE + '\n' +
                'Комментарий: ' + data?.comment + '\n' +
                'Дата и время заказа: ' + data?.dataMsg
            );
            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Ваш заказ №' + data?.numberOrder + " готов" + '\n' +
                "Cделано с любовью ☕️");
            }, 5000)

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

// app.get('/buy/:id', async (req, res) => {
//     /* парсим тело req (или скорее всего сам url) */
//     console.log(req)
//     await  bot.sendMessage(1035730958,
//         // id: queryId,
//         // title: 'Успешная покупка',
//         'cool'
//         // message_text: ` Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')}`
//
//     )
//     return res.status(200).json("es");
// })

const PORT = 8080;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))




