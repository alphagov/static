/**
 * @preserve
 *
 * Suchi.js -- No user left behind.
 *
 * Copyright 2012-2013:
 *      Alex Russell <slightlyoff@chromium.org>
 *      Frances Berriman <phaeness@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(global) {
  var suchi = global.suchi = global.suchi || {};

  /*
   * There is no feature test for staleness.
   *
   * Tight regular expressions to test for the most prevalant stale browsers as
   * reported by:
   *  http://marketshare.hitslink.com/browser-market-share.aspx?qprid=2&qpcustomd=0
   *
   * This list will be actively maintained. I.e., as IE 11 is launched, IE 10
   * goes into the list; when Chrome 25 goes to stable, Chrome 24 goes in the
   * list, etc.
   *
   * Browsers are usually removed from the list as they fall below 1% reach.
   *
   * Note that there's some OS bias in the regexes below. E.g., Linux isn't
   * well-detected. This is sort of a bug, but largely a reflection of it's lack
   * of userbase at the time of writing.
   */
  suchi.laggards = {
    // IE 9:     17%
    // Mozilla/5.0 (Windows; U; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727)
    // IE9: /^Mozilla\/5\.0 \(compatible; MSIE 9\.0; Windows NT \d\.\d(.*); Trident\/5\.0(.*)\)$/g,
    IE9: /^Mozilla\/5\.0 \(compatible; MSIE 9\.0; Windows NT \d\.\d(.*)\)$/g,

    // IE 8:     11%
    // IE8: /^Mozilla\/4\.0 \(compatible; MSIE 8\.0; Windows NT \d\.\d;(.*)? Trident\/4\.0(;)?(.*)\)$/g,
    IE8: /^Mozilla\/4\.0 \(compatible; MSIE 8\.0; Windows NT \d\.\d(.*)\)$/g,

    // IE 7:      ?%
    // FIXME: test for Trident version #
    IE7: /^Mozilla\/4\.0 \(compatible; MSIE 7\.0; Windows NT \d\.\d(.*)\)$/g,

    // IE 6:      ?%
    // FIXME: test for Trident version #
    IE6: /^Mozilla\/4\.0 \(compatible; MSIE 6\.0; Windows NT \d\.\d(.*)\)$/g,

    // FF 3.6:    0.X%
    // Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6;en-US; rv:1.9.2.9) Gecko/20100824 Firefox/3.6.9
    FF36: /^Mozilla\/5\.0 \((Windows|Macintosh); U;(.*)rv\:1\.9\.2.(\d{1,2})\)( Gecko\/(\d{8}))? Firefox\/3\.6(\.\d{1,2})?( \(.+\))?$/g,

    // Chrome 16-23: ~1.2%
    CR_recent: /^Mozilla\/5\.0 \((Windows NT|Macintosh)(;)?( .*)\) AppleWebKit\/53\d\.\d{1,2} \(KHTML, like Gecko\) Chrome\/(16|17|18|19|20|21|22|23)\.0\.\d{3,4}\.\d{1,2} Safari\/53\d\.\d{1,2}$/g,

    // FF 9-16:  ~3.7%
    // Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:16.0) Gecko/20100101 Firefox/16.0
    FF_recent: /^Mozilla\/5\.0 \((Windows NT \d\.\d|Macintosh); (.*)rv\:(9|10|11|12|13|14|15|16)\.0(\.\d{1,2})?\) Gecko\/\d{8} Firefox\/(9|10|11|12|13|14|15|16)\.0(\.\d{1,2})?$/g,

    // FIXME(slightlyoff): should we be handling any iOS detection here?
    SAF51: /^Mozilla\/5\.0 \((Windows NT \d\.\d|Macintosh)(.*)\) AppleWebKit\/534\.\d{2}(\.\d{1,2})? \(KHTML, like Gecko\) Version\/5\.1\.\d Safari\/534\.\d{2}(\.\d{1,2})?$/g

    // FIXME(slightlyoff): need to add mobile laggards, notably all versions of
    // the Android Browser and Safari 5.1. Upgrade advice is much trickier here,
    // though, so perhaps we should surface this through a separate API.
  };

  /**
   * Tests a string to see if it matches one of the current most frequently
   * used "left behind" browsers.
   * @param {string} ua The UA String to test.
   * @return {boolean}
   */
  suchi.isOld = function(ua) {
    if (typeof ua != "string") { return false; }

    for (var x in this.laggards) {
      if (ua.match(this.laggards[x])) {
        return true;
      }
    }
    return false;
  };
})(this);