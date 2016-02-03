import {inject, computedFrom} from 'aurelia-framework';
import $ from 'jquery';
import 'libs/jquery.signalR';
import 'libs/hubs';
import {Logger} from 'service';

@inject(Logger)
export class TestWS {

  constructor(logger) {
    this.logger = logger;

    this.proxy = $.connection.echoHub;
    this.proxy.client.showAlert = msg => {
      this.logger.warn('alert: ' + msg);
    };

    this.proxy.client.message = msg => {
      this.logger.info('message: ' + msg);
    };

    this.proxy.client.newUser = userId => {
      this.logger.info("New user with id: " + userId);
    };


    $.connection.hub.url = "http://localhost:2222/realtime";
    $.connection.hub.logging = true;
    $.connection.hub.start({
      // todo: windows 7 :(... needs to be enabled for prod
      //transport: 'webSockets'
    })
      .done(function () {
        $.connection.hub.log("My id: " + $.connection.hub.id);
      })
      .fail(function() {
        alert("Connection failed!");
      });


/*


    proxy.server.sum(3, 4)
      .done(function(result) {
        alert(result);
      });

    // example: handling erros

    proxy.server.changeNickname('newNickname')
      .fail(function(err) {
        if (err.source === 'HubException') {
          console.log(e.data.user+" -> "+ e.message);
        }
      });

 */

  }

  callObiWan() {
    this.proxy.server.obiWanMessage();
  }
}
