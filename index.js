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

    if (text === '/start') {
        console.log(msg.text);
        await bot.sendMessage(chatId, "Здравствуйте!\n" +
            "Мы ради приветствовать Вас в нашем новом боте!\n Выберите интересуюший для вас раздел: ", {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Визитка', web_app: {url: WebAppUrl + '/main'}}],
                    [{text: 'Меню', web_app: {url: WebAppUrl + '/menu'}}],
                    [{text: 'Наши контакты', web_app: {url: WebAppUrl + '/map'}}],
                    [{text: 'Оформить заказ - прототип для приложения', web_app: {url: WebAppUrl + '/checkF'}}],
                ]
            }
        })
        setTimeout(async () => {
            await bot.sendMessage(chatId, "Для оформления заказа с браузера - пропишите команду: /orderweb");
        }, 500)
    }

    else if (text === '/menu') {
        console.log(msg.text);
        await bot.sendMessage(chatId, "Актуальное меню на данный момент", {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Меню', web_app: {url: WebAppUrl + '/menu'}}]
                ]
            }
        })
    }
    else if(text === '/orderweb') {
        console.log(msg.text);
        await bot.sendMessage(chatId, 'Приятных покупок' + '\n' +
            "Ниже появится кнопка для оформления заказа", {
            reply_markup: {
                keyboard: [
                    [{text: 'Оформить заказ', web_app: {url: WebAppUrl + '/form'}}],
                ]
            }
        })
    } else if(text === '/business_card') {
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
    } else if(text === '/contacts') {
        console.log(msg.text);
        await bot.sendMessage(chatId, 'Мы всегда будем рады Вас видеть: ', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Наши контакты', web_app: {url: WebAppUrl + '/map'}}],
                ]
            }
        })
    }else if(text === '/order') {
        console.log(msg.text);
        await bot.sendMessage(chatId, 'Приятных покупок', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Оформить заказ', web_app: {url: WebAppUrl + '/checkF'}}],
                ]
            }
        })
    }


    else if(text === '/helpchoice') {
        console.log(msg.text);
        await bot.sendMessage(chatId, 'Что бы выхотели? Горячее или холодное?', {
            reply_markup: {
                keyboard: [
                    [{text: 'Горячее'}],
                    [{text: 'Холодное'}],
                ]
            }
        })
    }

    else if (text === "Горячее")  {
        await bot.sendMessage(chatId, 'Хмм..может быть что-то связанное с кофе? Да или нет?', {
            reply_markup: {
                keyboard: [
                    [{text: 'Да'}],
                    [{text: 'Нет'}],
                ]
            }
        })
    }
    else if (text === "Холодное")  {
        await bot.sendMessage(chatId, 'Тогда предлагаем вам ознакомиться со списком освежающих ', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Лимонады, смузи и молочные коктейли', web_app: {url: WebAppUrl + '/cold'}}],
                ]
            }
        })
        setTimeout(async () => {
            await bot.sendMessage(chatId, "Ниже представлены новинки сезона:", {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Новинки', web_app: {url: WebAppUrl + '/new_drink'}}],
                    ]
                }
            })
        }, 100)
    }
    else if (text === "Да")  {
        await bot.sendMessage(chatId, 'Категории напитков, которые могут вам понравиться, предаставлены ниже', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Авторский кофе', web_app: {url: WebAppUrl + '/author_coffee'}}],
                    [{text: 'Классический кофе', web_app: {url: WebAppUrl + '/classic_coffee'}}],
                ]
            }
        })
        setTimeout(async () => {
            await bot.sendMessage(chatId, "или попробуете новинки сезона?", {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Новинки', web_app: {url: WebAppUrl + '/new_drinks'}}],
                    ]
                }
            })
        }, 100)
    }

    else if (text === "Нет")  {
        await bot.sendMessage(chatId, 'Тогда можем угостить вас сегодня чаем, приготовленный как кдассическим методом, так и на основе ягод и фруктов', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Чай', web_app: {url: WebAppUrl + '/tea'}}],
                ]
            }
        })
        setTimeout(async () => {
            await bot.sendMessage(chatId, "или же что-нибудь из новинок сезона?", {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Новинки', web_app: {url: WebAppUrl + '/new_drink'}}],
                    ]
                }
            })
        }, 100)
    }

    else if (text.indexOf('/') !== -1){
        await bot.sendMessage(chatId, 'Такой команды не существует' + '\n' +
            "/start - Приветсвтие \n" +
            "/menu - Главное меню\n" +
            "/order - Оформить заказ с приложения \n" +
            "/business_card - Визитка\n" +
            "/contacts - Контакты \n" +
            "/helpchoice - Помощь с выбором\n" +
            "/orderweb - Оформить заказа с браузера"
        );
    } else {
        await bot.sendMessage(chatId, 'Сообщение не распознано')
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




