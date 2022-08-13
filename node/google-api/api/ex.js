// const googleTrends = require("google-trends-api");

// const obj = {
//     // 検索ワード
//     keyword: "node",
//     // 地域
//     geo: "JP",
//     // 検索する言語
//     hl: "ja",
//     // 検索期間開始日
//     startTime: new Date("2020-01-01"),
//     // 検索期間終了日
//     endTime: new Date("2020-07-01"),
// };

// googleTrends.relatedQueries(obj).then(results => {
//     // jsonで結果が帰ってくるので整形する
//     const json = JSON.parse(results);

//     // 
//     for (let i = 0; i < json.default.rankedList[0].rankedKeyword.length; i++) {
//         console.log("検索ワード" + json.default.rankedList[0].rankedKeyword[i].query + ": 検索率(1～100)" + json.default.rankedList[0].rankedKeyword[i].value);
//     } 
// }).catch(err => {
//     // エラー発生時の処理
//     console.error(err);
// });

// (async function test(){
//     const json = await googleTrends.dailyTrends({
//         trendDate: new Date('2022-08-10'),
//         geo: 'JP',
//       });
//     const obj = JSON.parse(json);
//     console.log(obj["default"]["trendingSearchesDays"][0]);
// })();

'use strict';

var googleTrends = require('google-trends-api');

/* ******************* Autocomplete **************************/

// googleTrends.autoComplete({keyword: 'Back to school',geo: "JP",hl: "ja"})
// .then((res) => {
//   console.log('this is res', res);
// })
// .catch((err) => {
//   console.log('got the error', err);
//   console.log('error message', err.message);
//   console.log('request body',  err.requestBody);
// });

/* ******************* Interest over time **************************/

// googleTrends.interestOverTime({keyword: 'Valentines Day',geo: "JP",hl: "ja"})
// .then((res) => {
//   console.log('this is res', res);
// })
// .catch((err) => {
//   console.log('got the error', err);
//   console.log('error message', err.message);
//   console.log('request body',  err.requestBody);
// });

// googleTrends.interestOverTime({
//   keyword: 'JR東日本',
//   geo: "JP",
//   hl: "ja",
//   startTime: new Date(Date.now() - (3*24*60 * 60 * 1000)),
//   granularTimeResolution: true
// }, function(err, results) {
//   if (err) console.log('oh no error!', err);
// //   else console.log(results);
// //   console.log(JSON.parse(results)["default"]["timelineData"]);
// console.log(JSON.parse(results)["default"]["timelineData"].length);
//   for(let i = 0; i<JSON.parse(results)["default"]["timelineData"].length; i++){
//     console.log(JSON.parse(results)["default"]["timelineData"][i]["value"][0], JSON.parse(results)["default"]["timelineData"][i]["formattedTime"]);
//   }
// });

/* ****** Interest over time - Set a custom timezone ***************/

// googleTrends.interestOverTime({
//   keyword: 'Valentines Day',
//   timezone: new Date().getTimezoneOffset() / 60,
// }, function(err, results) {
//   if (err) console.log('oh no error!', err);
//   else console.log(results);
// });

/* ****** Interest over time - Comparing multiple keywords *********/
// googleTrends.interestOverTime({keyword: ['Valentines Day', 'Christmas Day']})
// .then((res) => {
//   console.log('this is res', res);
// })
// .catch((err) => {
//   console.log('got the error', err);
// })

/* ******************* Interest by region **************************/

// googleTrends.interestByRegion({
//   keyword: 'Donald Trump',
//   startTime: new Date('2017-02-01'),
//   endTime: new Date('2017-02-06'),
//   resolution: 'COUNTRY',
// })
// .then((res) => {
//   console.log(res);
// })
// .catch((err) => {
//   console.log(err);
// })

// googleTrends.interestByRegion({
//   keyword: 'Donald Trump',
//   startTime: new Date('2017-02-01'),
//   endTime: new Date('2017-02-06'),
//   geo: 'US-CA',
// })
// .then((res) => {
//   console.log(res);
// })
// .catch((err) => {
//   console.log(err);
// })

/* ******************* Related queries **************************/

// googleTrends.relatedQueries({
//     keyword: 'JR東日本',
//     // startTime: new Date(Date.now() - (60 * 60 * 1000)),
//     geo: "JP",
//     hl: "ja"
// })
// .then((res) => {
//   console.log(res);
// })
// .catch((err) => {
//   console.log(err);
// })
//１つ目が割合２つ目が絶対量

/* ******************* Related topics **************************/

// googleTrends.relatedTopics({
//   keyword: 'Chipotle',
//   startTime: new Date('2015-01-01'),
//   endTime: new Date('2017-02-10'),
// })
// .then((res) => {
//   console.log(res);
// })
// .catch((err) => {
//   console.log(err);
// });

/* ************************* RealTime Trending Searches  ******************/
// googleTrends.realTimeTrends({
//   geo: 'JP',
//   category: 'all',
// }, function(err, results) {
//    if (err) console.log('oh no error!', err);
//    else console.log(results);
// //    else console.log(JSON.parse(results)["storySummaries"]["trendingStories"]);
// });

/* ***********************  Daily Trends *******************************/
// Please note that google only keeps around T-15 days of daily trends information.
// TrendDate designation that go too far back in the past will result in an error.
// Note: TrendDate is optional and will default to currentDate

// googleTrends.dailyTrends({
// //    trendDate: new Date('2022-08-10'),
//    geo: 'JP',
// }, function(err, results) {
//    if (err) {
//      console.log('oh no error!', err);
//    }else{
//      console.log(JSON.parse(results)["default"]["trendingSearchesDays"][0]["trendingSearches"]);
//    }
// }); 