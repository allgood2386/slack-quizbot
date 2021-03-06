'use strict';

const _ = require('lodash');

const quizRepo = require('./quiz-repo');

const badQuestionReporter = {
    start
};

function start(slackChannel) {
    setupReportListener(slackChannel, reportDetails => {
        quizRepo.reportBadQuestion(reportDetails)
        .then(() => {
            slackChannel.send(`${reportDetails.questionId} reported, you won't see it again in its current form. Thanks, ${reportDetails.reporter}!`);
        });
    });
}

function setupReportListener(slackChannel, cb) {
    slackChannel.on('msg', msgDetails => {
        const matchedCommand = msgDetails.text.match(/^(!report)\s(\d*)\s(.+)$/) // "!report 58758 this is rubbish"
        if (!_.isArray(matchedCommand)) {
            return;
        }
        const report = matchedCommand.splice(1);
        if (report.length < 2 || report[0] !== '!report') {
            return;
        }
        return cb({
            questionId: report[1],
            note: report[2],
            reporter: msgDetails.userName
        });
    });
}

//const questionHandler = {
//    start
//};
//
//makeEventEmitter(questionHandler);
//
//
//const states = {
//    idle: 'idle',
//    waitingForAnswer: 'waitingForAnswer'
//};
//let current = {
//    state: states.idle,
//    timeQuestionAsked: null,
//    questionTimeOutId: null,
//    quizItem: null
//};
//
//function start(slackChannel) {
//    slackChannel.on('msg', msgDetails => {
//        if (current.state === states.idle) {
//            if (msgDetails.prunedText !== 'q') {
//                return;
//            }
//            current.state = states.waitingForAnswer;
//            quizRepo.getRandomQuestion()
//                .then(doc => {
//                    current.quizItem = doc;
//                    console.log(doc);
//                    current.timeQuestionAsked = new Date();
//                    current.questionTimeOutId = setTimeout(function () {
//                        current.state = states.idle;
//                        slackChannel.send('Time up! The answer was: ' + current.quizItem.a);
//                    }, questionTimeoutSec * 1000);
//                    slackChannel.send(util.format('[%s] %s ( %s )',
//                        doc.id, doc.q, formatAsBlanks(doc.a)));
//                });
//        }
//        else if (current.state === states.waitingForAnswer) {
//            if (msgDetails.prunedText == prune(current.quizItem.a)) {
//                clearTimeout(current.questionTimeOutId);
//                current.state = states.idle;
//                var timeDelta = (new Date() - current.timeQuestionAsked) / 1000;
//                slackChannel.send(msgDetails.userName + " answered correctly in " + timeDelta + " seconds");
//                questionHandler.emit('correctAnswer', {
//                    userName: msgDetails.userName,
//                    answerTime: timeDelta
//                });
//            }
//        }
//    });
//}
//
//function formatAsBlanks(string) {
//    return string.replace(/\w/g, 'x');
//}
//
//function prune (text) {
//    return text.toLowerCase().trim();
//}
//
//function makeEventEmitter(obj) {
//    obj.__proto__ = Object.create(EventEmitter.prototype);
//}

module.exports = badQuestionReporter;
