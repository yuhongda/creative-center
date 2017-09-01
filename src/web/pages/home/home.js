import React, { Component } from 'react';
import { observable, computed, toJS } from 'mobx'
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import Message from 'vic-common/lib/components/antd/message';
import { autobind } from 'core-decorators';
import styles from './home.m.scss';
import icon from './iconfont.scss';
import tmpls from './home.t.html';
import moment from 'moment';

// @inject('store')
@observer
@registerTmpl('Home')
export default class Home extends Component {

  @observable current = 1;
  @observable anim = '';
  @observable zoomIn = '';

  constructor(props) {
      super(props);
  }

  componentDidMount() {
    let self = this;
    setTimeout(function() {
      self.anim = 'anim';
    }, 500);

    setTimeout(function() {
      self.zoomIn = 'zoomIn'
    }, 800);

    var ParallaxBanner = (function () {

        var parallaxObjects = $('[data-pb="true"]'),
            options = {
                rotateX: 5,
                rotateY: 5,
                translateX: 3,
                translateY: 3
            };

        var bindEvent = function (obj) {

            obj.bind('mousemove', function(e){

                var posX = e.pageX - obj.offset().left,
                    posY = e.pageY - obj.offset().top,
                    degreeX, degreeY, translateX, translateY;

                //horizontal
                if(posX < obj.width() / 2){

                    var ratio = 1 - posX / (obj.width() / 2),
                        degree = options.rotateX * ratio;

                    degreeY = -degree;
                    translateX = -options.translateX * ratio;


                }else{

                    var ratio = (posX - (obj.width() / 2)) / (obj.width() / 2),
                        degree = options.rotateX * ratio;

                    degreeY = degree;
                    translateX = options.translateX * ratio;

                }

                //vertical
                if(posY < obj.width() / 2){

                    var ratio = 1 - posY / (obj.height() / 2),
                        degree = options.rotateY * ratio;

                    degreeX = degree;
                    translateY = -options.translateY * ratio;

                }else{

                    var ratio = (posY - (obj.height() / 2)) / (obj.height() / 2),
                        degree = options.rotateY * ratio;

                    degreeX = -degree;
                    translateY = options.translateY * ratio;

                }

                obj.css({ 'transform': 'rotateX(' + degreeX + 'deg) rotateY('+ degreeY +'deg)' });
                obj.find('.layer-1').css({ 'transform': 'translate3d(' + translateX + 'px, ' + translateY +'px,0'});
                obj.find('.layer-2').css({ 'transform': 'translate3d(' + translateX * 1.5 + 'px, ' + translateY* 1.5+'px,0'});
                obj.find('.layer-3').css({ 'transform': 'translate3d(' + translateX * 3 + 'px, ' + translateY*3 +'px,0'});

            }).bind('mouseout', function(){
                obj.css({ 'transform': 'rotateX(0deg) rotateY(0deg)' });
                obj.find('.layer-1').css({ 'transform': 'translate3d(0,0,0'});
                obj.find('.layer-2').css({ 'transform': 'translate3d(0,0,0'});
                obj.find('.layer-3').css({ 'transform': 'translate3d(0,0,0'});
            });
        };

        var init = function (_options) {

            options = $.extend(options, _options);

            parallaxObjects.each(function () {
                var obj = $(this);
                bindEvent(obj);
            });
        };

        return {
            init: init,
            bindEvent: bindEvent
        };
    })();

    ParallaxBanner.init();



  }

  @autobind
  onItemClicked(index){
    return (e) => {
      this.current = index;
    }
  }

  @autobind
  login(){
    //   window.location.href = '//passport.jd.com/new/login.aspx?ReturnUrl=' + window.location.href.split('/').slice(0,-1).join('/');
      window.location.href = '//passport.jd.com/new/login.aspx?ReturnUrl=http://' + window.location.host;
  }

  render() {
    return tmpls.home(this.state, this.props, this, {
      styles,
      img1: require('../../images/home/intro-img-1.jpg'),
      img2: require('../../images/home/intro-img-2.jpg'),
      img3: require('../../images/home/intro-img-3.jpg'),
      img4: require('../../images/home/intro-img-4.jpg'),
      img5: require('../../images/home/intro-img-5.jpg'),
      year: moment().format('YYYY')
    });
  }
}
