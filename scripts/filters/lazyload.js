/* global hexo */

'use strict';

hexo.extend.filter.register('after_post_render', function (data) {
  var theme = hexo.theme.config;
  if (!theme.lazyload || !theme.lazyload.enable) {
    return;
  }

  data.content = data.content.replace(
    /<img([^>]*)src="([^"]*)"([^>]*)>/gim,
    function (match, attrBegin, src, attrEnd) {
      // Exit if the src doesn't exists.
      if (!src) {
        return match;
      }

      // Smallest 1 * 1 pixel transparent gif
      var loadingBlock = 'data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs=';
      var loadingGIF = `/${(theme.images && theme.images.replace(/^\/+|\/+$/gm,'')) || 'images'}/loading.svg`;
      var phClassName = theme.lazyload.placeholder;
      var placeholder = '';

      if (phClassName === 'gif') {
        placeholder = loadingGIF;
      } else if (phClassName === 'block') {
        placeholder = loadingBlock;
      }

      return `
        <img ${attrBegin} class="lazyload lazyload-${phClassName}"
          src="${placeholder}" data-src="${src}" ${attrEnd}>`;
    }
  );
}, 1);
