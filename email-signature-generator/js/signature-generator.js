/**
 * Email Signature Generator
 * Vanilla JS — no dependencies. Exposes window.EmailSignatureApp
 */
(function (global) {
  'use strict';

  /** Gallery display order — templates 03 & 04 shown last */
  var TEMPLATE_IDS = [
    'esg-sig-01',
    'esg-sig-02',
    'esg-sig-05',
    'esg-sig-06',
    'esg-sig-07',
    'esg-sig-08',
    'esg-sig-09',
    'esg-sig-10',
    'esg-sig-03',
    'esg-sig-04'
  ];

  /** Email-safe font — Tahoma stack used throughout */
  var FONTS = {
    name: 'Tahoma,Geneva,Arial,sans-serif',
    body: 'Tahoma,Geneva,Arial,sans-serif',
    contact: 'Tahoma,Geneva,Arial,sans-serif'
  };

  var SOCIAL_FIELDS = ['linkedin', 'youtube', 'facebook', 'instagram', 'twitter', 'pinterest'];
  var CONTACT_FIELDS = ['phone', 'email', 'website', 'address'];

  /** Escape HTML entities in user text */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /** Ensure URL has protocol */
  function normalizeUrl(url) {
    if (!url) return '';
    var trimmed = url.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return 'https://' + trimmed;
  }

  /** Display website without protocol */
  function displayWebsite(url) {
    if (!url) return '';
    return url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
  }

  var imageProcessor = {
    /**
     * Process uploaded file: resize if > maxScaleFactor × target, return data URL
     * @param {File} file
     * @param {number} targetW
     * @param {number} targetH
     * @param {number} maxScaleFactor
     * @returns {Promise<string>}
     */
    process: function (file, targetW, targetH, maxScaleFactor) {
      return new Promise(function (resolve, reject) {
        if (!file || !file.type.match(/^image\//)) {
          reject(new Error('Please select a valid image file.'));
          return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
          var img = new Image();
          img.onload = function () {
            var maxW = targetW * maxScaleFactor;
            var maxH = targetH * maxScaleFactor;
            var w = img.width;
            var h = img.height;
            var scale = 1;
            if (w > maxW || h > maxH) {
              scale = Math.min(maxW / w, maxH / h);
            }
            var outW = Math.round(w * scale);
            var outH = Math.round(h * scale);
            var canvas = document.createElement('canvas');
            canvas.width = outW;
            canvas.height = outH;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, outW, outH);
            var usePng = file.type === 'image/png';
            var mime = usePng ? 'image/png' : 'image/jpeg';
            var quality = usePng ? undefined : 0.85;
            resolve(canvas.toDataURL(mime, quality));
          };
          img.onerror = function () {
            reject(new Error('Failed to load image.'));
          };
          img.src = e.target.result;
        };
        reader.onerror = function () {
          reject(new Error('Failed to read file.'));
        };
        reader.readAsDataURL(file);
      });
    },

    /**
     * Load image from URL, resize if needed, return base64 data URL
     * @param {string} url
     * @param {number} targetW
     * @param {number} targetH
     * @param {number} maxScaleFactor
     * @param {boolean} [usePng]
     * @returns {Promise<string>}
     */
    processFromUrl: function (url, targetW, targetH, maxScaleFactor, usePng) {
      return new Promise(function (resolve, reject) {
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
          resolve(imageProcessor._canvasDataUrl(img, targetW, targetH, maxScaleFactor, usePng));
        };
        img.onerror = function () {
          reject(new Error('Failed to load image: ' + url));
        };
        img.src = url;
      });
    },

    /** Resize an existing data URL image for email signatures */
    processFromDataUrl: function (dataUrl, targetW, targetH, maxScaleFactor, usePng) {
      return new Promise(function (resolve, reject) {
        if (!dataUrl) {
          resolve('');
          return;
        }
        var img = new Image();
        img.onload = function () {
          resolve(imageProcessor._canvasDataUrl(img, targetW, targetH, maxScaleFactor, usePng));
        };
        img.onerror = function () {
          reject(new Error('Failed to load embedded demo image.'));
        };
        img.src = dataUrl;
      });
    },

    _canvasDataUrl: function (img, targetW, targetH, maxScaleFactor, usePng) {
      var maxW = targetW * maxScaleFactor;
      var maxH = targetH * maxScaleFactor;
      var w = img.width;
      var h = img.height;
      var scale = 1;
      if (w > maxW || h > maxH) {
        scale = Math.min(maxW / w, maxH / h);
      }
      var outW = Math.round(w * scale);
      var outH = Math.round(h * scale);
      var canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, outW, outH);
      var mime = usePng ? 'image/png' : 'image/jpeg';
      return canvas.toDataURL(mime, usePng ? undefined : 0.85);
    }
  };

  var formState = {
    /**
     * Read form values from root element
     * @param {Element} root
     * @returns {Object}
     */
    read: function (root) {
      var get = function (name) {
        var el = root.querySelector('[data-esg-field="' + name + '"]');
        return el ? el.value.trim() : '';
      };
      var colorEl = root.querySelector('input[data-esg-field="accentColor"]');
      return {
        name: get('name'),
        title: get('title'),
        email: get('email'),
        website: get('website'),
        phone: get('phone'),
        address: get('address'),
        companyName: get('companyName'),
        tagline: get('tagline'),
        otherInfo: get('otherInfo'),
        linkedin: get('linkedin'),
        youtube: get('youtube'),
        facebook: get('facebook'),
        instagram: get('instagram'),
        twitter: get('twitter'),
        pinterest: get('pinterest'),
        accentColor: colorEl ? colorEl.value : '#222222',
        profileImageBase64: root.getAttribute('data-esg-profile') || '',
        logoBase64: root.getAttribute('data-esg-logo') || ''
      };
    },

    validate: function () {
      return [];
    }
  };

  /** Apply optional demo/sample data when init({ demo: true }) — see js/demo-data.js */
  var demoData = {
    applyFields: function (root, data) {
      var fields = Object.keys(data);
      for (var i = 0; i < fields.length; i++) {
        var key = fields[i];
        if (
          key === 'profileUrl' ||
          key === 'logoUrl' ||
          key === 'profileImageBase64' ||
          key === 'logoBase64'
        ) {
          continue;
        }
        var el = root.querySelector('[data-esg-field="' + key + '"]');
        if (el) el.value = data[key];
      }
      var accentText = root.querySelector('[data-esg-field="accentColorText"]');
      if (accentText) accentText.value = data.accentColor;
    },

    load: function (root, doc, options) {
      var data = options.demoData || global.EmailSignatureDemoData;
      if (!data) {
        return Promise.resolve();
      }
      demoData.applyFields(root, data);

      var profilePromise = data.profileImageBase64
        ? imageProcessor.processFromDataUrl(data.profileImageBase64, 110, 110, 2, false)
        : data.profileUrl
          ? imageProcessor.processFromUrl(data.profileUrl, 110, 110, 2, false)
          : Promise.resolve('');

      var logoPromise = data.logoBase64
        ? imageProcessor.processFromDataUrl(data.logoBase64, 200, 80, 2, true)
        : data.logoUrl
          ? imageProcessor.processFromUrl(data.logoUrl, 200, 80, 2, true)
          : Promise.resolve('');

      return Promise.all([profilePromise, logoPromise]).then(function (results) {
        mediaUi.setImage(root, 'profile', results[0]);
        mediaUi.setImage(root, 'logo', results[1]);
        if (options.autoGenerate !== false) {
          gallery.render(root, doc, formState.read(root));
        }
      });
    }
  };

  /** Profile / logo preview and remove controls */
  var mediaUi = {
    setImage: function (root, type, dataUrl) {
      var attr = type === 'profile' ? 'data-esg-profile' : 'data-esg-logo';
      var preview = root.querySelector('[data-esg-preview="' + type + '"]');
      var upload = root.querySelector('.esg-upload--' + type);
      var removeBtn = root.querySelector('[data-esg-remove="' + type + '"]');
      var input = root.querySelector('[data-esg-upload="' + type + '"]');
      var hasImage = !!dataUrl;

      root.setAttribute(attr, hasImage ? dataUrl : '');
      if (preview) {
        preview.innerHTML = hasImage
          ? '<img src="' + dataUrl + '" alt="' + (type === 'profile' ? 'Profile' : 'Logo') + ' preview" />'
          : '';
      }
      if (upload) upload.classList.toggle('esg-upload--has-image', hasImage);
      if (removeBtn) removeBtn.hidden = !hasImage;
      if (input) input.value = '';
    },

    clearImage: function (root, type) {
      mediaUi.setImage(root, type, '');
    }
  };

  var iconHelper = {
    /** Template 02 (Modern Minimal) reference icon sizing */
    CONTACT_ICON_SIZE: 14,
    SOCIAL_ICON_SIZE: 14,
    SOCIAL_BOX: 28,
    escapeXml: function (str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    },

    svgToDataUri: function (svg) {
      return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
    },

    /** Darken hex for gradient endpoints */
    darken: function (hex, amount) {
      var num = parseInt(hex.replace('#', ''), 16);
      var r = Math.max(0, ((num >> 16) & 0xff) - amount);
      var g = Math.max(0, ((num >> 8) & 0xff) - amount);
      var b = Math.max(0, (num & 0xff) - amount);
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },

    /** Split company name into stacked brand lines */
    splitCompanyBrand: function (companyName) {
      if (!companyName) return { line1: '', line2: '' };
      var parts = companyName.trim().split(/\s+/);
      if (parts.length === 1) {
        return { line1: parts[0].toUpperCase(), line2: '' };
      }
      return {
        line1: parts[0].toUpperCase(),
        line2: parts.slice(1).join(' ').toUpperCase()
      };
    },

    /** Lighten hex (legacy — prefer accentAlpha for soft tints) */
    lighten: function (hex, amount) {
      var num = parseInt(hex.replace('#', ''), 16);
      var r = Math.min(255, ((num >> 16) & 0xff) + amount);
      var g = Math.min(255, ((num >> 8) & 0xff) + amount);
      var b = Math.min(255, (num & 0xff) + amount);
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },

    /** Accent color at reduced opacity — soft tints without pink lighten artifacts */
    accentAlpha: function (hex, alpha) {
      var h = (hex || '#882B42').replace('#', '');
      var num = parseInt(h, 16);
      var r = (num >> 16) & 0xff;
      var g = (num >> 8) & 0xff;
      var b = num & 0xff;
      return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
    },

    /** Soft background/border tint from the selected accent */
    accentSoft: function (hex, alpha) {
      return this.accentAlpha(hex, alpha !== undefined ? alpha : 0.15);
    },

    /** Secondary accent — same hue as selected color, not a lightened pink */
    deriveSecondary: function (hex) {
      return hex || '#882B42';
    },

    getIconSvg: function (doc, iconName, accentColor, size, iconColor) {
      var tpl = doc.getElementById('esg-icon-' + iconName);
      if (!tpl) return '';
      var clone = tpl.content.cloneNode(true);
      var svg = clone.querySelector('svg');
      if (!svg) return '';
      var sz = size || 16;
      svg.setAttribute('width', sz);
      svg.setAttribute('height', sz);
      svg.setAttribute('style', 'display:block;margin:0 auto;');
      var color = iconColor || accentColor;
      var paths = svg.querySelectorAll('path');
      for (var p = 0; p < paths.length; p++) {
        paths[p].setAttribute('fill', color);
      }
      var div = document.createElement('div');
      div.appendChild(clone);
      return div.innerHTML;
    },

    /** Wrap icon in centered table cell (email-safe) */
    wrapIconCell: function (innerHtml, w, h, extraStyle) {
      return (
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:' +
        w +
        'px;height:' +
        h +
        'px;' +
        (extraStyle || '') +
        '"><tr><td align="center" valign="middle" style="text-align:center;vertical-align:middle;line-height:0;">' +
        innerHtml +
        '</td></tr></table>'
      );
    },

    /** Single social icon — circle | square | plain | square-light | outline | soft-circle | circle-outline */
    buildSocialIcon: function (doc, key, url, data, style) {
      var href = normalizeUrl(url);
      var accent = data.accentColor;
      var lightBg = iconHelper.accentSoft(accent, 0.15);
      var box = this.SOCIAL_BOX;
      var iconSize = this.SOCIAL_ICON_SIZE;
      var icon;
      var cellExtra = '';
      var linkStyle = 'text-decoration:none;display:inline-block;line-height:0;';

      if (style === 'plain') {
        icon = this.getIconSvg(doc, key, accent, this.SOCIAL_ICON_SIZE, accent);
        return (
          '<a href="' +
          escapeHtml(href) +
          '" target="_blank" style="' +
          linkStyle +
          'padding:0 2px;">' +
          icon +
          '</a>'
        );
      }

      if (style === 'compact') {
        icon = this.getIconSvg(doc, key, accent, this.SOCIAL_ICON_SIZE, accent);
        return (
          '<a href="' +
          escapeHtml(href) +
          '" target="_blank" style="' +
          linkStyle +
          '">' +
          icon +
          '</a>'
        );
      }

      if (style === 'soft-circle') {
        icon = this.getIconSvg(doc, key, accent, iconSize, accent);
        cellExtra = 'background:#f3f4f6;border-radius:50%;';
      } else if (style === 'circle-outline') {
        icon = this.getIconSvg(doc, key, accent, iconSize, accent);
        cellExtra = 'background:#ffffff;border:1px solid ' + escapeHtml(accent) + ';border-radius:50%;';
      } else if (style === 'outline') {
        icon = this.getIconSvg(doc, key, accent, iconSize, '#ffffff');
        cellExtra = 'border:1px solid #ffffff;border-radius:50%;background:transparent;';
      } else if (style === 'circle') {
        icon = this.getIconSvg(doc, key, accent, iconSize, '#ffffff');
        cellExtra = 'background:' + escapeHtml(accent) + ';border-radius:50%;';
      } else if (style === 'circle-large') {
        icon = this.getIconSvg(doc, key, accent, iconSize, '#ffffff');
        cellExtra = 'background:' + escapeHtml(accent) + ';border-radius:50%;';
      } else if (style === 'circle-outline-light') {
        icon = this.getIconSvg(doc, key, accent, iconSize, accent);
        cellExtra =
          'border:1px solid ' + escapeHtml(accent) + ';border-radius:50%;background:#ffffff;';
      } else if (style === 'circle-outline-medium') {
        icon = this.getIconSvg(doc, key, accent, iconSize, accent);
        cellExtra =
          'border:1px solid ' + escapeHtml(accent) + ';border-radius:50%;background:#ffffff;';
      } else if (style === 'circle-outline-xl') {
        icon = this.getIconSvg(doc, key, accent, iconSize, accent);
        cellExtra =
          'border:1px solid ' + escapeHtml(accent) + ';border-radius:50%;background:#ffffff;';
      } else if (style === 'circle-outline-luxury') {
        icon = this.getIconSvg(doc, key, accent, iconSize, accent);
        cellExtra =
          'border:1px solid ' + escapeHtml(accent) + ';border-radius:50%;background:#ffffff;';
      } else if (style === 'square') {
        icon = this.getIconSvg(doc, key, accent, iconSize, '#ffffff');
        cellExtra = 'background:' + escapeHtml(accent) + ';border-radius:5px;';
      } else if (style === 'square-light') {
        icon = this.getIconSvg(doc, key, accent, iconSize, accent);
        cellExtra = 'background:' + lightBg + ';border-radius:6px;';
      } else {
        icon = this.getIconSvg(doc, key, accent, iconSize, '#ffffff');
        cellExtra = 'background:' + escapeHtml(accent) + ';border-radius:50%;';
      }

      return (
        '<a href="' +
        escapeHtml(href) +
        '" target="_blank" style="' +
        linkStyle +
        '">' +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">' +
        '<tr><td align="center" valign="middle" style="width:' +
        box +
        'px;height:' +
        box +
        'px;text-align:center;vertical-align:middle;line-height:0;mso-line-height-rule:exactly;' +
        cellExtra +
        '">' +
        icon +
        '</td></tr></table></a>'
      );
    },

    /** Build social row as table — horizontal or vertical */
    buildSocialRow: function (doc, data, style, direction) {
      style = style || 'circle';
      direction = direction || 'horizontal';
      var map = {
        linkedin: data.linkedin,
        youtube: data.youtube,
        facebook: data.facebook,
        instagram: data.instagram,
        twitter: data.twitter,
        pinterest: data.pinterest
      };
      var keys = Object.keys(map);
      var cells = [];
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (!map[key]) continue;
        cells.push(this.buildSocialIcon(doc, key, map[key], data, style));
      }
      if (!cells.length) return '';

      if (style === 'compact') {
        return (
          '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">' +
          '<tr><td style="vertical-align:middle;line-height:0;">' +
          cells.join('<span style="color:#d1d5db;font-size:12px;padding:0 6px;">|</span>') +
          '</td></tr></table>'
        );
      }

      if (direction === 'vertical') {
        var vertGap = style === 'circle-large' ? '10px' : '8px';
        var rows = cells
          .map(function (c) {
            return '<tr><td style="padding:0 0 ' + vertGap + ' 0;line-height:0;">' + c + '</td></tr>';
          })
          .join('');
        return '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">' + rows + '</table>';
      }

      var gap =
        style === 'plain'
          ? '10px'
          : style === 'circle-outline-xl'
            ? '18px'
            : style === 'circle-outline-medium'
              ? '12px'
              : style === 'circle-large'
                ? '10px'
                : style === 'circle-outline-light'
                  ? '8px'
                  : '8px';
      var tds = cells
        .map(function (c, idx) {
          var pad = idx < cells.length - 1 ? 'padding-right:' + gap + ';' : '';
          return '<td style="vertical-align:middle;line-height:0;' + pad + '">' + c + '</td>';
        })
        .join('');
      return '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>' + tds + '</tr></table>';
    },

    /** Vertical social columns — max N icons per column (08 Profile Stack) */
    buildSocialRowVerticalColumns: function (doc, data, style, maxPerColumn) {
      style = style || 'circle-large';
      maxPerColumn = maxPerColumn || 3;
      var map = {
        linkedin: data.linkedin,
        youtube: data.youtube,
        facebook: data.facebook,
        instagram: data.instagram,
        twitter: data.twitter,
        pinterest: data.pinterest
      };
      var keys = Object.keys(map);
      var cells = [];
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (!map[key]) continue;
        cells.push(this.buildSocialIcon(doc, key, map[key], data, style));
      }
      if (!cells.length) return '';

      var vertGap = style === 'circle-large' ? '10px' : '8px';
      var columns = [];
      for (var c = 0; c < cells.length; c += maxPerColumn) {
        columns.push(cells.slice(c, c + maxPerColumn));
      }

      var colTds = '';
      for (var col = 0; col < columns.length; col++) {
        var colCells = columns[col];
        var rows = '';
        for (var r = 0; r < colCells.length; r++) {
          var rowPad = r < colCells.length - 1 ? 'padding:0 0 ' + vertGap + ' 0;' : '';
          rows += '<tr><td style="' + rowPad + 'line-height:0;">' + colCells[r] + '</td></tr>';
        }
        var colPad = col > 0 ? 'padding-left:10px;' : '';
        colTds +=
          '<td style="vertical-align:middle;line-height:0;' +
          colPad +
          '">' +
          '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">' +
          rows +
          '</table></td>';
      }

      return (
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>' +
        colTds +
        '</tr></table>'
      );
    },
    buildSocialRowOutlineDots: function (doc, data) {
      var accent = data.accentColor;
      var secondary = this.deriveSecondary(accent);
      var map = {
        linkedin: data.linkedin,
        youtube: data.youtube,
        facebook: data.facebook,
        instagram: data.instagram,
        twitter: data.twitter,
        pinterest: data.pinterest
      };
      var keys = Object.keys(map);
      var parts = [];
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (!map[key]) continue;
        parts.push(this.buildSocialIcon(doc, key, map[key], data, 'circle-outline-luxury'));
      }
      if (!parts.length) return '';

      var tds = '';
      for (var j = 0; j < parts.length; j++) {
        tds += '<td style="vertical-align:middle;line-height:0;">' + parts[j] + '</td>';
        if (j < parts.length - 1) {
          tds +=
            '<td style="padding:0 8px;color:' +
            escapeHtml(secondary) +
            ';font-size:14px;vertical-align:middle;font-family:Tahoma,Geneva,Arial,sans-serif;line-height:1;">&#8226;</td>';
        }
      }
      return (
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>' +
        tds +
        '</tr></table>'
      );
    },

    /** Wrap social row for centered alignment in email clients */
    wrapSocialRowCenter: function (socialHtml) {
      if (!socialHtml) return '';
      return (
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;border-collapse:collapse;">' +
        '<tr><td align="center" style="text-align:center;line-height:0;mso-line-height-rule:exactly;">' +
        socialHtml +
        '</td></tr></table>'
      );
    },

    buildSocialRowCentered: function (doc, data, style) {
      return this.wrapSocialRowCenter(this.buildSocialRow(doc, data, style || 'circle-large', 'horizontal'));
    },

    contactLine: function (doc, field, data) {
      var val = data[field];
      if (!val) return '';
      var iconName = field === 'website' ? 'website' : field;
      var icon = this.getIconSvg(doc, iconName, data.accentColor, this.CONTACT_ICON_SIZE, data.accentColor);
      var link = '';
      if (field === 'email') {
        link =
          '<a href="mailto:' +
          escapeHtml(val) +
          '" style="color:#374151;text-decoration:none;">' +
          escapeHtml(val) +
          '</a>';
      } else if (field === 'website') {
        link =
          '<a href="' +
          escapeHtml(normalizeUrl(val)) +
          '" style="color:#374151;text-decoration:none;">' +
          escapeHtml(displayWebsite(val)) +
          '</a>';
      } else if (field === 'phone') {
        link =
          '<a href="tel:' +
          escapeHtml(val.replace(/\s/g, '')) +
          '" style="color:#374151;text-decoration:none;">' +
          escapeHtml(val) +
          '</a>';
      } else {
        link = '<span style="color:#374151;">' + escapeHtml(val) + '</span>';
      }
      return (
        '<tr>' +
        '<td style="padding:2px 6px 2px 0;vertical-align:middle;width:18px;line-height:0;">' +
        icon +
        '</td>' +
        '<td style="padding:2px 0;font-family:Tahoma,Geneva,Arial,sans-serif;font-size:13px;vertical-align:middle;color:#374151;">' +
        link +
        '</td></tr>'
      );
    },

    /** Contact line with icon inside a light circle */
    contactLineCircle: function (doc, field, data) {
      var val = data[field];
      if (!val) return '';
      var iconName = field === 'website' ? 'website' : field;
      var box = this.SOCIAL_BOX;
      var icon = this.getIconSvg(doc, iconName, data.accentColor, this.CONTACT_ICON_SIZE, data.accentColor);
      var link = '';
      if (field === 'email') {
        link =
          '<a href="mailto:' +
          escapeHtml(val) +
          '" style="color:#374151;text-decoration:none;">' +
          escapeHtml(val) +
          '</a>';
      } else if (field === 'website') {
        link =
          '<a href="' +
          escapeHtml(normalizeUrl(val)) +
          '" style="color:#374151;text-decoration:none;">' +
          escapeHtml(displayWebsite(val)) +
          '</a>';
      } else if (field === 'phone') {
        link =
          '<a href="tel:' +
          escapeHtml(val.replace(/\s/g, '')) +
          '" style="color:#374151;text-decoration:none;">' +
          escapeHtml(val) +
          '</a>';
      } else {
        link = '<span style="color:#374151;">' + escapeHtml(val) + '</span>';
      }
      return (
        '<tr>' +
        '<td style="padding:0 4px 0 0;vertical-align:middle;width:' +
        box +
        'px;line-height:0;mso-line-height-rule:exactly;">' +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">' +
        '<tr><td align="center" valign="middle" style="width:' +
        box +
        'px;height:' +
        box +
        'px;text-align:center;vertical-align:middle;line-height:0;mso-line-height-rule:exactly;background:#f3f4f6;border-radius:50%;">' +
        icon +
        '</td></tr></table></td>' +
        '<td style="padding:0;font-family:Tahoma,Geneva,Arial,sans-serif;font-size:13px;vertical-align:middle;color:#374151;line-height:1.25;">' +
        link +
        '</td></tr>'
      );
    },

    /** Contact line for dark backgrounds */
    contactLineDark: function (doc, field, data) {
      var val = data[field];
      if (!val) return '';
      var iconName = field === 'website' ? 'website' : field;
      var icon = this.getIconSvg(doc, iconName, data.accentColor, this.CONTACT_ICON_SIZE, iconHelper.deriveSecondary(data.accentColor));
      var link = '';
      if (field === 'email') {
        link =
          '<a href="mailto:' +
          escapeHtml(val) +
          '" style="color:#e5e7eb;text-decoration:none;">' +
          escapeHtml(val) +
          '</a>';
      } else if (field === 'website') {
        link =
          '<a href="' +
          escapeHtml(normalizeUrl(val)) +
          '" style="color:#e5e7eb;text-decoration:none;">' +
          escapeHtml(displayWebsite(val)) +
          '</a>';
      } else if (field === 'phone') {
        link =
          '<a href="tel:' +
          escapeHtml(val.replace(/\s/g, '')) +
          '" style="color:#e5e7eb;text-decoration:none;">' +
          escapeHtml(val) +
          '</a>';
      } else {
        link = '<span style="color:#e5e7eb;">' + escapeHtml(val) + '</span>';
      }
      return (
        '<tr>' +
        '<td style="padding:2px 6px 2px 0;vertical-align:middle;width:18px;line-height:0;">' +
        icon +
        '</td>' +
        '<td style="padding:2px 0;font-family:Tahoma,Geneva,Arial,sans-serif;font-size:13px;vertical-align:middle;color:#e5e7eb;">' +
        link +
        '</td></tr>'
      );
    },

    /** Build two-column contact block */
    buildContactTwoCol: function (doc, data) {
      var fields = ['phone', 'email', 'website', 'address'];
      var left = '';
      var right = '';
      var count = 0;
      for (var i = 0; i < fields.length; i++) {
        var line = this.contactLine(doc, fields[i], data);
        if (!line) continue;
        if (count % 2 === 0) left += line;
        else right += line;
        count++;
      }
      if (!left && !right) return '';
      return (
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>' +
        '<td style="vertical-align:top;padding-right:12px;width:50%;">' +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0">' +
        left +
        '</table></td>' +
        '<td style="vertical-align:top;width:50%;">' +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0">' +
        right +
        '</table></td></tr></table>'
      );
    },

    /** Build compact horizontal contact rows (2 items per row) */
    buildContactGrid: function (doc, data) {
      var items = [];
      var fields = ['phone', 'email', 'website', 'address'];
      for (var i = 0; i < fields.length; i++) {
        var val = data[fields[i]];
        if (!val) continue;
        var iconName = fields[i] === 'website' ? 'website' : fields[i];
        var icon = this.getIconSvg(doc, iconName, data.accentColor, this.CONTACT_ICON_SIZE, data.accentColor);
        var text = '';
        if (fields[i] === 'email') {
          text =
            '<a href="mailto:' +
            escapeHtml(val) +
            '" style="color:#374151;text-decoration:none;font-size:12px;">' +
            escapeHtml(val) +
            '</a>';
        } else if (fields[i] === 'website') {
          text =
            '<a href="' +
            escapeHtml(normalizeUrl(val)) +
            '" style="color:#374151;text-decoration:none;font-size:12px;">' +
            escapeHtml(displayWebsite(val)) +
            '</a>';
        } else if (fields[i] === 'phone') {
          text =
            '<a href="tel:' +
            escapeHtml(val.replace(/\s/g, '')) +
            '" style="color:#374151;text-decoration:none;font-size:12px;">' +
            escapeHtml(val) +
            '</a>';
        } else {
          text = '<span style="color:#374151;font-size:12px;">' + escapeHtml(val) + '</span>';
        }
        items.push(
          '<td style="padding:4px 12px 4px 0;vertical-align:middle;white-space:nowrap;">' +
            icon +
            ' <span style="padding-left:4px;">' +
            text +
            '</span></td>'
        );
      }
      if (!items.length) return '';
      var rows = '';
      for (var j = 0; j < items.length; j += 2) {
        var sep =
          j + 1 < items.length
            ? '<td style="width:1px;background:#e5e7eb;font-size:0;">&nbsp;</td>'
            : '';
        rows +=
          '<tr>' +
          items[j] +
          sep +
          (items[j + 1] || '<td></td>') +
          '</tr>';
      }
      return (
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="font-family:Tahoma,Geneva,Arial,sans-serif;">' +
        rows +
        '</table>'
      );
    },

    buildContactCircle: function (doc, data) {
      var fields = ['phone', 'email', 'website', 'address'];
      var rows = '';
      for (var i = 0; i < fields.length; i++) {
        rows += this.contactLineCircle(doc, fields[i], data);
      }
      return rows;
    },

    buildContactDark: function (doc, data) {
      var fields = ['phone', 'email', 'website', 'address'];
      var rows = '';
      for (var i = 0; i < fields.length; i++) {
        rows += this.contactLineDark(doc, fields[i], data);
      }
      return rows;
    },

    /** Contact line for 03 Dark Profile Card right column */
    contactLineCard: function (doc, field, data) {
      var val = data[field];
      if (!val) return '';
      var iconName = field === 'website' ? 'website' : field;
      var icon = this.getIconSvg(doc, iconName, data.accentColor, this.CONTACT_ICON_SIZE, data.accentColor);
      var link = '';
      if (field === 'email') {
        link =
          '<a href="mailto:' +
          escapeHtml(val) +
          '" style="color:#444444;text-decoration:none;">' +
          escapeHtml(val) +
          '</a>';
      } else if (field === 'website') {
        link =
          '<a href="' +
          escapeHtml(normalizeUrl(val)) +
          '" style="color:#444444;text-decoration:none;">' +
          escapeHtml(displayWebsite(val)) +
          '</a>';
      } else if (field === 'phone') {
        link =
          '<a href="tel:' +
          escapeHtml(val.replace(/\s/g, '')) +
          '" style="color:#444444;text-decoration:none;">' +
          escapeHtml(val) +
          '</a>';
      } else {
        link = '<span style="color:#444444;">' + escapeHtml(val) + '</span>';
      }
      return (
        '<tr>' +
        '<td style="vertical-align:middle;width:18px;line-height:0;mso-line-height-rule:exactly;">' +
        icon +
        '</td>' +
        '<td style="width:12px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>' +
        '<td style="vertical-align:middle;font-family:Tahoma,Geneva,Arial,sans-serif;font-size:14px;color:#444444;line-height:1.35;">' +
        link +
        '</td></tr>'
      );
    },

    /** Stacked contact lines for 03 Dark Profile Card */
    buildCardContactBlock: function (doc, data) {
      var fields = ['phone', 'email', 'website', 'address'];
      var rows = '';
      var added = false;
      for (var i = 0; i < fields.length; i++) {
        var line = this.contactLineCard(doc, fields[i], data);
        if (!line) continue;
        if (added) {
          rows +=
            '<tr><td colspan="3" style="height:7px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td></tr>';
        }
        rows += line;
        added = true;
      }
      if (!rows) return '';
      return (
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Tahoma,Geneva,Arial,sans-serif;">' +
        rows +
        '</table>'
      );
    },

    /** Contact line for 01 Vertical Card — matches standard template typography */
    contactLineSpaced: function (doc, field, data) {
      var val = data[field];
      if (!val) return '';
      var iconName = field === 'website' ? 'website' : field;
      var icon = this.getIconSvg(doc, iconName, data.accentColor, this.CONTACT_ICON_SIZE, data.accentColor);
      var link = '';
      if (field === 'email') {
        link =
          '<a href="mailto:' +
          escapeHtml(val) +
          '" style="color:#374151;text-decoration:none;">' +
          escapeHtml(val) +
          '</a>';
      } else if (field === 'website') {
        link =
          '<a href="' +
          escapeHtml(normalizeUrl(val)) +
          '" style="color:#374151;text-decoration:none;">' +
          escapeHtml(displayWebsite(val)) +
          '</a>';
      } else if (field === 'phone') {
        link =
          '<a href="tel:' +
          escapeHtml(val.replace(/\s/g, '')) +
          '" style="color:#374151;text-decoration:none;">' +
          escapeHtml(val) +
          '</a>';
      } else {
        link = '<span style="color:#374151;">' + escapeHtml(val) + '</span>';
      }
      return (
        '<tr>' +
        '<td style="padding:2px 6px 2px 0;vertical-align:middle;width:18px;line-height:0;mso-line-height-rule:exactly;">' +
        icon +
        '</td>' +
        '<td style="padding:2px 0;font-family:Tahoma,Geneva,Arial,sans-serif;font-size:13px;vertical-align:middle;color:#374151;line-height:1.35;">' +
        link +
        '</td></tr>'
      );
    },

    /** Icon + text pair for 02 Modern Minimal inline contact rows */
    contactInlinePair: function (doc, field, data, fontSize) {
      var val = data[field];
      if (!val) return '';
      var fs = fontSize || 13;
      var iconName = field === 'website' ? 'website' : field;
      var icon = this.getIconSvg(doc, iconName, data.accentColor, this.CONTACT_ICON_SIZE, data.accentColor);
      var text = '';
      if (field === 'email') {
        text =
          '<a href="mailto:' +
          escapeHtml(val) +
          '" style="color:#374151;text-decoration:none;font-size:' +
          fs +
          'px;">' +
          escapeHtml(val) +
          '</a>';
      } else if (field === 'website') {
        text =
          '<a href="' +
          escapeHtml(normalizeUrl(val)) +
          '" style="color:#374151;text-decoration:none;font-size:' +
          fs +
          'px;">' +
          escapeHtml(displayWebsite(val)) +
          '</a>';
      } else if (field === 'phone') {
        text =
          '<a href="tel:' +
          escapeHtml(val.replace(/\s/g, '')) +
          '" style="color:#374151;text-decoration:none;font-size:' +
          fs +
          'px;">' +
          escapeHtml(val) +
          '</a>';
      } else {
        text =
          '<span style="color:#374151;font-size:' + fs + 'px;">' + escapeHtml(val) + '</span>';
      }
      return (
        '<td style="vertical-align:middle;width:20px;line-height:0;mso-line-height-rule:exactly;">' +
        icon +
        '</td>' +
        '<td style="padding-left:6px;vertical-align:middle;font-family:Tahoma,Geneva,Arial,sans-serif;">' +
        text +
        '</td>'
      );
    },

    /** Two-row inline contact grid for 02 Modern Minimal */
    buildModernMinimalContactBlock: function (doc, data) {
      var row1 = '';
      var row2 = '';
      var hasPhone = !!data.phone;
      var hasEmail = !!data.email;
      var hasWebsite = !!data.website;
      var hasAddress = !!data.address;

      if (hasPhone || hasEmail) {
        row1 = '<tr>';
        if (hasPhone) {
          row1 += this.contactInlinePair(doc, 'phone', data);
        }
        if (hasPhone && hasEmail) {
          row1 +=
            '<td style="padding:0 10px;color:#d1d5db;font-size:13px;vertical-align:middle;font-family:Tahoma,Geneva,Arial,sans-serif;">|</td>';
        }
        if (hasEmail) {
          row1 += this.contactInlinePair(doc, 'email', data);
        }
        row1 += '</tr>';
      }

      if (hasWebsite || hasAddress) {
        if (row1) {
          row2 +=
            '<tr><td colspan="5" style="height:4px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td></tr>';
        }
        row2 += '<tr>';
        if (hasWebsite) {
          row2 += this.contactInlinePair(doc, 'website', data);
        }
        if (hasWebsite && hasAddress) {
          row2 +=
            '<td style="padding:0 10px;color:#d1d5db;font-size:13px;vertical-align:middle;font-family:Tahoma,Geneva,Arial,sans-serif;">|</td>';
        }
        if (hasAddress) {
          row2 += this.contactInlinePair(doc, 'address', data);
        }
        row2 += '</tr>';
      }

      if (!row1 && !row2) return '';
      return (
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Tahoma,Geneva,Arial,sans-serif;">' +
        row1 +
        row2 +
        '</table>'
      );
    },

    /** Icon + text rows for 01 Vertical Card (right column, below identity) */
    buildVerticalCardContactBlock: function (doc, data) {
      var fields = ['phone', 'email', 'website', 'address'];
      var rows = '';
      for (var i = 0; i < fields.length; i++) {
        rows += this.contactLineSpaced(doc, fields[i], data);
      }
      if (!rows) return '';
      return (
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Tahoma,Geneva,Arial,sans-serif;">' +
        rows +
        '</table>'
      );
    },

    /** Horizontal gap cell between contact icon and text (email-safe nbsp) */
    contactIconGapCell: function () {
      return (
        '<td style="width:6px;font-size:13px;line-height:1;white-space:nowrap;vertical-align:middle;mso-line-height-rule:exactly;">&nbsp;</td>'
      );
    },

    /** Single contact row for 08 Profile Stack — icon + text table row */
    contactLineStacked: function (doc, field, data) {
      var val = data[field];
      if (!val) return '';
      var iconName = field === 'website' ? 'website' : field;
      var icon = this.getIconSvg(doc, iconName, data.accentColor, this.CONTACT_ICON_SIZE, data.accentColor);
      var link = '';
      if (field === 'email') {
        link =
          '<a href="mailto:' +
          escapeHtml(val) +
          '" style="color:#444444;text-decoration:none;font-size:13px;line-height:1.4rem;">' +
          escapeHtml(val) +
          '</a>';
      } else if (field === 'website') {
        link =
          '<a href="' +
          escapeHtml(normalizeUrl(val)) +
          '" style="color:#444444;text-decoration:none;font-size:13px;line-height:1.4rem;">' +
          escapeHtml(displayWebsite(val)) +
          '</a>';
      } else if (field === 'phone') {
        link =
          '<a href="tel:' +
          escapeHtml(val.replace(/\s/g, '')) +
          '" style="color:#444444;text-decoration:none;font-size:13px;line-height:1.4rem;">' +
          escapeHtml(val) +
          '</a>';
      } else {
        link = '<span style="color:#444444;font-size:13px;line-height:1.4rem;">' + escapeHtml(val) + '</span>';
      }
      return (
        '<tr>' +
        '<td width="18" style="width:18px;vertical-align:middle;line-height:0;mso-line-height-rule:exactly;">' +
        icon +
        '</td>' +
        this.contactIconGapCell() +
        '<td style="font-size:13px;color:#444444;line-height:1.4rem;vertical-align:middle;font-family:Tahoma,Geneva,Arial,sans-serif;">' +
        link +
        '</td>' +
        '</tr>'
      );
    },

    /** Stacked contact rows for 08 Profile Stack */
    buildProfileStackContactBlock: function (doc, data) {
      var fields = ['phone', 'email', 'website', 'address'];
      var rows = '';
      for (var i = 0; i < fields.length; i++) {
        rows += this.contactLineStacked(doc, fields[i], data);
      }
      if (!rows) return '';
      return (
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Tahoma,Geneva,Arial,sans-serif;">' +
        rows +
        '</table>'
      );
    },

    /** Contact lines for 04 Elegant Card */
    buildElegantCardContactBlock: function (doc, data) {
      var fields = ['phone', 'email', 'website', 'address'];
      var rows = '';
      var added = false;
      for (var i = 0; i < fields.length; i++) {
        var line = this.contactLineCard(doc, fields[i], data);
        if (!line) continue;
        if (added) {
          rows +=
            '<tr><td colspan="3" style="height:6px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td></tr>';
        }
        rows += line;
        added = true;
      }
      if (!rows) return '';
      return (
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:18px;border-collapse:collapse;font-family:Tahoma,Geneva,Arial,sans-serif;">' +
        rows +
        '</table>'
      );
    },

    /** Single luxury contact row with soft circle icon */
    contactLineLuxury: function (doc, field, data) {
      var val = data[field];
      if (!val) return '';
      var accent = data.accentColor;
      var lightBg = this.accentSoft(accent, 0.15);
      var iconName = field === 'website' ? 'website' : field;
      var icon = this.getIconSvg(doc, iconName, accent, this.CONTACT_ICON_SIZE, accent);
      var link = '';
      if (field === 'email') {
        link =
          '<a href="mailto:' +
          escapeHtml(val) +
          '" style="color:#222222;text-decoration:none;font-size:14px;">' +
          escapeHtml(val) +
          '</a>';
      } else if (field === 'website') {
        link =
          '<a href="' +
          escapeHtml(normalizeUrl(val)) +
          '" style="color:#222222;text-decoration:none;font-size:14px;">' +
          escapeHtml(displayWebsite(val)) +
          '</a>';
      } else if (field === 'phone') {
        link =
          '<a href="tel:' +
          escapeHtml(val.replace(/\s/g, '')) +
          '" style="color:#222222;text-decoration:none;font-size:14px;">' +
          escapeHtml(val) +
          '</a>';
      } else {
        link = '<span style="color:#222222;font-size:14px;">' + escapeHtml(val) + '</span>';
      }
      return (
        '<tr>' +
        '<td width="32" align="center" style="width:32px;text-align:center;vertical-align:middle;">' +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 auto;">' +
        '<tr><td align="center" valign="middle" style="width:' +
        this.SOCIAL_BOX +
        'px;height:' +
        this.SOCIAL_BOX +
        'px;border-radius:50%;background:' +
        escapeHtml(lightBg) +
        ';text-align:center;vertical-align:middle;line-height:0;mso-line-height-rule:exactly;">' +
        icon +
        '</td></tr></table></td>' +
        this.contactIconGapCell() +
        '<td style="padding:5px 0;vertical-align:middle;font-family:Tahoma,Geneva,Arial,sans-serif;">' +
        link +
        '</td></tr>'
      );
    },

    /** Contact block for 05 Luxury Split */
    buildLuxuryContactBlock: function (doc, data) {
      var fields = ['phone', 'email', 'website', 'address'];
      var rows = '';
      var added = false;
      for (var i = 0; i < fields.length; i++) {
        var line = this.contactLineLuxury(doc, fields[i], data);
        if (!line) continue;
        if (added) {
          rows +=
            '<tr><td colspan="3" style="border-top:1px solid #ececec;height:1px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td></tr>';
        }
        rows += line;
        added = true;
      }
      if (!rows) return '';
      return (
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:8px;border-collapse:collapse;font-family:Tahoma,Geneva,Arial,sans-serif;">' +
        rows +
        '</table>'
      );
    },

    /** Jewelry divider row for 05 Luxury Split left column */
    buildCompanyJewelryDivider: function (data) {
      var brand = this.splitCompanyBrand(data.companyName);
      if (!brand.line2) return '';
      var accent = data.accentColor || '#882B42';
      var secondary = this.deriveSecondary(accent);
      return (
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin-top:6px;border-collapse:collapse;">' +
        '<tr>' +
        '<td style="width:36px;border-top:1px solid ' +
        escapeHtml(secondary) +
        ';font-size:0;line-height:0;height:1px;">&nbsp;</td>' +
        '<td style="padding:0 10px;font-family:' +
        FONTS.name +
        ';font-size:12px;font-weight:700;letter-spacing:4px;color:#111111;white-space:nowrap;">' +
        escapeHtml(brand.line2) +
        '</td>' +
        '<td style="width:36px;border-top:1px solid ' +
        escapeHtml(secondary) +
        ';font-size:0;line-height:0;height:1px;">&nbsp;</td>' +
        '</tr></table>'
      );
    },

    buildCompanyBrandLine2Block: function (data) {
      var brand = this.splitCompanyBrand(data.companyName);
      if (!brand.line2) return '';
      return (
        '<p style="margin:6px 0 0;font-size:10px;letter-spacing:3px;color:#ffffff;font-weight:600;line-height:1.3;font-family:' +
        FONTS.body +
        ';">' +
        escapeHtml(brand.line2) +
        '</p>'
      );
    },

    /** Contact row with solid accent icon circle for 07 Luxury Banner */
    contactLineLuxuryPanel: function (doc, field, data) {
      var val = data[field];
      if (!val) return '';
      var accent = data.accentColor;
      var secondary = this.deriveSecondary(accent);
      var iconName = field === 'website' ? 'website' : field;
      var icon = this.getIconSvg(doc, iconName, accent, this.CONTACT_ICON_SIZE, '#ffffff');
      var link = '';
      if (field === 'email') {
        link =
          '<a href="mailto:' +
          escapeHtml(val) +
          '" style="color:#222222;text-decoration:none;font-size:14px;">' +
          escapeHtml(val) +
          '</a>';
      } else if (field === 'website') {
        link =
          '<a href="' +
          escapeHtml(normalizeUrl(val)) +
          '" style="color:#222222;text-decoration:none;font-size:14px;">' +
          escapeHtml(displayWebsite(val)) +
          '</a>';
      } else if (field === 'phone') {
        link =
          '<a href="tel:' +
          escapeHtml(val.replace(/\s/g, '')) +
          '" style="color:#222222;text-decoration:none;font-size:14px;">' +
          escapeHtml(val) +
          '</a>';
      } else {
        link = '<span style="color:#222222;font-size:14px;">' + escapeHtml(val) + '</span>';
      }
      return (
        '<tr>' +
        '<td width="32" align="center" style="width:32px;text-align:center;vertical-align:middle;">' +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 auto;">' +
        '<tr><td align="center" valign="middle" style="width:' +
        this.SOCIAL_BOX +
        'px;height:' +
        this.SOCIAL_BOX +
        'px;border-radius:50%;background:' +
        escapeHtml(accent) +
        ';text-align:center;vertical-align:middle;line-height:0;mso-line-height-rule:exactly;">' +
        icon +
        '</td></tr></table></td>' +
        '<td width="16" align="center" style="width:16px;color:' +
        escapeHtml(secondary) +
        ';font-size:18px;vertical-align:middle;font-family:Tahoma,Geneva,Arial,sans-serif;">|</td>' +
        '<td style="padding:10px 0;vertical-align:middle;font-family:Tahoma,Geneva,Arial,sans-serif;">' +
        link +
        '</td></tr>'
      );
    },

    /** Contact block for 07 Luxury Banner */
    buildLuxuryPanelContactBlock: function (doc, data) {
      var fields = ['phone', 'email', 'website', 'address'];
      var lines = [];
      for (var i = 0; i < fields.length; i++) {
        var line = this.contactLineLuxuryPanel(doc, fields[i], data);
        if (line) lines.push(line);
      }
      if (!lines.length) return '';
      var rows = '';
      for (var j = 0; j < lines.length; j++) {
        if (j > 0) {
          rows +=
            '<tr><td colspan="3" style="border-top:1px solid #dddddd;height:1px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td></tr>';
        }
        rows += lines[j];
      }
      return (
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:20px;border-collapse:collapse;font-family:Tahoma,Geneva,Arial,sans-serif;">' +
        rows +
        '</table>'
      );
    },

    /** Single centered contact cell for 06 Centered Card */
    centeredContactCell: function (doc, field, data, withTopBorder) {
      var val = data[field];
      if (!val) {
        return '<td style="font-size:0;line-height:0;">&nbsp;</td>';
      }
      var accent = data.accentColor;
      var iconName = field === 'website' ? 'website' : field;
      var icon = this.getIconSvg(doc, iconName, accent, this.CONTACT_ICON_SIZE, accent);
      var text = '';
      if (field === 'email') {
        text =
          '<a href="mailto:' +
          escapeHtml(val) +
          '" style="color:#444444;text-decoration:none;font-size:14px;">' +
          escapeHtml(val) +
          '</a>';
      } else if (field === 'website') {
        text =
          '<a href="' +
          escapeHtml(normalizeUrl(val)) +
          '" style="color:#444444;text-decoration:none;font-size:14px;">' +
          escapeHtml(displayWebsite(val)) +
          '</a>';
      } else if (field === 'phone') {
        text =
          '<a href="tel:' +
          escapeHtml(val.replace(/\s/g, '')) +
          '" style="color:#444444;text-decoration:none;font-size:14px;">' +
          escapeHtml(val) +
          '</a>';
      } else {
        text = '<span style="color:#444444;font-size:14px;">' + escapeHtml(val) + '</span>';
      }
      var topBorder = withTopBorder ? 'border-top:1px solid #eeeeee;' : '';
      return (
        '<td align="center" style="' +
        topBorder +
        'padding:10px 12px;vertical-align:middle;font-family:Tahoma,Geneva,Arial,sans-serif;">' +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="border-collapse:collapse;margin:0 auto;">' +
        '<tr><td style="vertical-align:middle;line-height:0;padding-right:6px;mso-line-height-rule:exactly;">' +
        icon +
        '</td><td style="vertical-align:middle;font-size:14px;color:#444444;line-height:1.35;">' +
        text +
        '</td></tr></table></td>'
      );
    },

    /** 2x2 bordered contact grid for 06 Centered Card */
    buildCenteredContactBox: function (doc, data) {
      var accent = data.accentColor;
      var hasAny =
        data.phone || data.email || data.website || data.address;
      if (!hasAny) return '';

      var row1 =
        '<tr>' +
        this.centeredContactCell(doc, 'phone', data, false) +
        '<td align="center" style="width:14px;color:' +
        escapeHtml(accent) +
        ';font-size:14px;vertical-align:middle;font-family:Tahoma,Geneva,Arial,sans-serif;">|</td>' +
        this.centeredContactCell(doc, 'email', data, false) +
        '</tr>';

      var row2 =
        '<tr>' +
        this.centeredContactCell(doc, 'website', data, true) +
        '<td align="center" style="border-top:1px solid #eeeeee;color:' +
        escapeHtml(accent) +
        ';font-size:14px;vertical-align:middle;width:14px;font-family:Tahoma,Geneva,Arial,sans-serif;">&#8226;</td>' +
        this.centeredContactCell(doc, 'address', data, true) +
        '</tr>';

      return (
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid ' +
        escapeHtml(accent) +
        ';border-radius:14px;border-collapse:separate;border-spacing:0;font-family:Tahoma,Geneva,Arial,sans-serif;">' +
        row1 +
        row2 +
        '</table>'
      );
    },

    buildGradientAccentPanel: function (data) {
      var accent = data.accentColor || '#882B42';
      var name = this.escapeXml((data.name || '').toUpperCase());
      var title = this.escapeXml(data.title || '');
      var company = this.escapeXml(data.companyName || '');
      var profile = data.profileImageBase64
        ? '<image href="' + this.escapeXml(data.profileImageBase64) + '" x="56" y="20" width="66" height="66" clip-path="url(#photoClip)" preserveAspectRatio="xMidYMid slice"/>'
        : '';
      var svg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="178" height="220" viewBox="0 0 178 220">' +
        '<defs>' +
        '<linearGradient id="panelGradient" x1="0" y1="0" x2="178" y2="220" gradientUnits="userSpaceOnUse">' +
        '<stop offset="0" stop-color="' + this.escapeXml(accent) + '"/>' +
        '<stop offset="0.58" stop-color="#c42f6a"/>' +
        '<stop offset="1" stop-color="#f47a3a"/>' +
        '</linearGradient>' +
        '<clipPath id="photoClip"><circle cx="89" cy="53" r="33"/></clipPath>' +
        '</defs>' +
        '<rect width="178" height="220" rx="10" fill="url(#panelGradient)"/>' +
        '<circle cx="89" cy="53" r="37" fill="#ffffff"/>' +
        profile +
        '<text x="89" y="118" fill="#ffffff" font-family="Tahoma, Geneva, Arial, sans-serif" font-size="15" font-weight="700" text-anchor="middle" letter-spacing=".4">' +
        name +
        '</text>' +
        '<rect x="67" y="135" width="44" height="2" fill="#ffffff"/>' +
        '<text x="89" y="165" fill="#ffffff" font-family="Tahoma, Geneva, Arial, sans-serif" font-size="12" text-anchor="middle">' +
        title +
        '</text>' +
        '<text x="89" y="188" fill="#ffffff" font-family="Tahoma, Geneva, Arial, sans-serif" font-size="12" font-weight="700" text-anchor="middle">' +
        company +
        '</text>' +
        '</svg>';
      return (
        '<img src="' +
        this.svgToDataUri(svg) +
        '" width="178" height="220" alt="' +
        this.escapeXml(data.name || '') +
        '" style="display:block;border:0;width:178px;height:220px;" />'
      );
    },

    buildSplitCurvePanel: function (data) {
      var accent = data.accentColor || '#882B42';
      var name = this.escapeXml(data.name || '');
      var title = this.escapeXml(data.title || '');
      var company = this.escapeXml(data.companyName || '');
      var profile = data.profileImageBase64
        ? '<image href="' + this.escapeXml(data.profileImageBase64) + '" x="72" y="22" width="76" height="76" clip-path="url(#photoClip)" preserveAspectRatio="xMidYMid slice"/>'
        : '';
      var svg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="210" viewBox="0 0 220 210">' +
        '<defs><clipPath id="photoClip"><circle cx="110" cy="60" r="38"/></clipPath></defs>' +
        '<path d="M0 52C0 23.3 23.3 0 52 0h140c-7 43-4 82 9 116 8 21 17 38 19 64H0V52z" fill="' +
        this.escapeXml(accent) +
        '"/>' +
        '<circle cx="110" cy="60" r="42" fill="#ffffff"/>' +
        profile +
        '<text x="110" y="122" fill="#ffffff" font-family="Tahoma, Geneva, Arial, sans-serif" font-size="16" font-weight="700" text-anchor="middle">' +
        name +
        '</text>' +
        '<text x="110" y="146" fill="#ffffff" font-family="Tahoma, Geneva, Arial, sans-serif" font-size="12" text-anchor="middle">' +
        title +
        '</text>' +
        '<text x="110" y="169" fill="#ffffff" font-family="Tahoma, Geneva, Arial, sans-serif" font-size="12" text-anchor="middle">' +
        company +
        '</text>' +
        '<rect x="95" y="184" width="30" height="1" fill="#ffffff" opacity=".7"/>' +
        '</svg>';
      return (
        '<img src="' +
        this.svgToDataUri(svg) +
        '" width="220" height="210" alt="' +
        this.escapeXml(data.name || '') +
        '" style="display:block;border:0;width:220px;height:210px;" />'
      );
    }
  };

  var templateEngine = {
    /**
     * Build replacement map from signature data
     */
    buildTokens: function (doc, data) {
      var accent = data.accentColor || '#882B42';
      var secondary = iconHelper.deriveSecondary(accent);
      var accentDark = iconHelper.darken(accent, 35);
      var companyBrand = iconHelper.splitCompanyBrand(data.companyName);
      var profileImg = '';
      if (data.profileImageBase64) {
        profileImg =
          '<img src="' +
          data.profileImageBase64 +
          '" alt="' +
          escapeHtml(data.name) +
          '" width="110" height="110" style="border-radius:50%;display:block;border:0;object-fit:cover;" />';
      }
      var profileImgLarge = '';
      if (data.profileImageBase64) {
        profileImgLarge =
          '<img src="' +
          data.profileImageBase64 +
          '" alt="' +
          escapeHtml(data.name) +
          '" width="140" height="140" style="border-radius:70px;display:block;border:0;object-fit:cover;" />';
      }
      var profileImgMedium = '';
      if (data.profileImageBase64) {
        profileImgMedium =
          '<img src="' +
          data.profileImageBase64 +
          '" alt="' +
          escapeHtml(data.name) +
          '" width="120" height="120" style="border-radius:60px;display:block;border:0;object-fit:cover;margin:0 auto;" />';
      }
      var profileImgCard = '';
      if (data.profileImageBase64) {
        profileImgCard =
          '<img src="' +
          data.profileImageBase64 +
          '" alt="' +
          escapeHtml(data.name) +
          '" width="78" height="78" style="display:block;border-radius:50%;border:0;object-fit:cover;background:#ffffff;margin:0 auto;" />';
      }
      var logoImg = '';
      if (data.logoBase64) {
        logoImg =
          '<img src="' +
          data.logoBase64 +
          '" alt="' +
          escapeHtml(data.companyName || 'Logo') +
          '" width="140" height="56" style="display:block;border:0;max-height:56px;width:auto;" />';
      }
      var logoImgLarge = '';
      if (data.logoBase64) {
        logoImgLarge =
          '<img src="' +
          data.logoBase64 +
          '" alt="' +
          escapeHtml(data.companyName || 'Logo') +
          '" width="100" height="40" style="display:block;border:0;max-height:40px;width:auto;margin:0 auto;" />';
      }
      var logoOnWhite = '';
      if (data.logoBase64) {
        logoOnWhite =
          '<div style="background:#ffffff;padding:6px 10px;border-radius:6px;display:inline-block;line-height:0;">' +
          logoImgLarge +
          '</div>';
      }
      var logoImgBranding = '';
      if (data.logoBase64) {
        logoImgBranding =
          '<img src="' +
          data.logoBase64 +
          '" alt="' +
          escapeHtml(data.companyName || 'Logo') +
          '" width="70" style="display:block;border:0;max-width:70px;max-height:70px;width:auto;height:auto;margin:0 auto;" />';
      }
      var logoImgBrandingElegant = '';
      if (data.logoBase64) {
        logoImgBrandingElegant =
          '<img src="' +
          data.logoBase64 +
          '" alt="' +
          escapeHtml(data.companyName || 'Logo') +
          '" width="140" style="display:block;border:0;max-width:140px;max-height:140px;width:auto;height:auto;margin:0 auto;" />';
      }
      var logoImgBrandingLetterhead = '';
      if (data.logoBase64) {
        logoImgBrandingLetterhead =
          '<img src="' +
          data.logoBase64 +
          '" alt="' +
          escapeHtml(data.companyName || 'Logo') +
          '" width="120" style="display:block;border:0;max-width:120px;max-height:120px;width:auto;height:auto;" />';
      }
      var logoImgDecor = '';
      if (data.logoBase64) {
        logoImgDecor =
          '<img src="' +
          data.logoBase64 +
          '" alt="" style="display:block;border:0;max-height:70px;width:auto;margin:0 auto;" />';
      }
      var logoImgCentered = '';
      if (data.logoBase64) {
        logoImgCentered =
          '<img src="' +
          data.logoBase64 +
          '" alt="' +
          escapeHtml(data.companyName || 'Logo') +
          '" width="120" height="120" style="display:block;border:0;margin:0 auto;max-width:120px;max-height:120px;width:auto;height:auto;object-fit:contain;" />';
      }
      var profileSmall = '';
      if (data.profileImageBase64) {
        profileSmall =
          '<img src="' +
          data.profileImageBase64 +
          '" alt="" width="80" height="80" style="border-radius:50%;display:block;border:0;object-fit:cover;" />';
      }
      var profileImageStack = '';
      if (data.profileImageBase64) {
        profileImageStack =
          '<img src="' +
          data.profileImageBase64 +
          '" alt="' +
          escapeHtml(data.name) +
          '" width="92" height="92" style="display:block;border-radius:50%;border:0;object-fit:cover;" />';
      }
      var profileImgLuxury = '';
      if (data.profileImageBase64) {
        var luxuryBorder = iconHelper.accentSoft(accent, 0.22);
        profileImgLuxury =
          '<img src="' +
          data.profileImageBase64 +
          '" alt="' +
          escapeHtml(data.name) +
          '" width="100" height="100" style="display:block;border-radius:50%;border:1px solid ' +
          escapeHtml(luxuryBorder) +
          ';object-fit:cover;margin:0 auto;" />';
      }
      var luxuryHeroImage = '';
      if (data.logoBase64) {
        luxuryHeroImage =
          '<img src="' +
          data.logoBase64 +
          '" alt="' +
          escapeHtml(data.companyName || 'Logo') +
          '" width="130" height="130" style="display:block;border-radius:50%;border:1px solid ' +
          escapeHtml(secondary) +
          ';background:#ffffff;object-fit:contain;margin:0 auto;padding:6px;" />';
      } else if (data.profileImageBase64) {
        luxuryHeroImage =
          '<img src="' +
          data.profileImageBase64 +
          '" alt="' +
          escapeHtml(data.name) +
          '" width="130" height="130" style="display:block;border-radius:50%;border:1px solid ' +
          escapeHtml(secondary) +
          ';background:#ffffff;object-fit:cover;margin:0 auto;" />';
      }
      var luxuryHeroBlock = luxuryHeroImage
        ? '<div style="margin-top:-48px;line-height:0;mso-line-height-rule:exactly;">' + luxuryHeroImage + '</div>'
        : '';
      var contactRows = '';
      contactRows += iconHelper.contactLine(doc, 'phone', data);
      contactRows += iconHelper.contactLine(doc, 'email', data);
      contactRows += iconHelper.contactLine(doc, 'website', data);
      contactRows += iconHelper.contactLine(doc, 'address', data);

      var contactInline = [];
      if (data.phone) contactInline.push(escapeHtml(data.phone));
      if (data.email)
        contactInline.push(
          '<a href="mailto:' + escapeHtml(data.email) + '" style="color:#333;text-decoration:none;">' + escapeHtml(data.email) + '</a>'
        );
      if (data.website)
        contactInline.push(
          '<a href="' +
            escapeHtml(normalizeUrl(data.website)) +
            '" style="color:#333;text-decoration:none;">' +
            escapeHtml(displayWebsite(data.website)) +
            '</a>'
        );

      var taglineBlock = data.tagline
        ? '<p style="margin:4px 0 0;font-family:' + FONTS.body + ';font-size:12px;color:#64748b;line-height:1.4;">' +
          escapeHtml(data.tagline) +
          '</p>'
        : '';
      var otherBlock = data.otherInfo
        ? '<p style="margin:4px 0 0;font-family:' + FONTS.body + ';font-size:12px;color:#64748b;">' +
          escapeHtml(data.otherInfo) +
          '</p>'
        : '';
      var companyBlock = data.companyName
        ? '<span style="font-family:' + FONTS.body + ';font-size:13px;color:' +
          escapeHtml(accent) +
          ';">' +
          escapeHtml(data.companyName) +
          '</span>'
        : '';
      var verticalCardContactBlock = iconHelper.buildVerticalCardContactBlock(doc, data);
      var modernMinimalContactBlock = iconHelper.buildModernMinimalContactBlock(doc, data);
      var cardContactBlock = iconHelper.buildCardContactBlock(doc, data);
      var elegantCardContactBlock = iconHelper.buildElegantCardContactBlock(doc, data);
      var luxuryContactBlock = iconHelper.buildLuxuryContactBlock(doc, data);
      var companyJewelryDivider = iconHelper.buildCompanyJewelryDivider(data);
      var companyBrandLine2Block = iconHelper.buildCompanyBrandLine2Block(data);
      var centeredContactBox = iconHelper.buildCenteredContactBox(doc, data);
      var luxuryPanelContactBlock = iconHelper.buildLuxuryPanelContactBlock(doc, data);
      var socialRowOutlineDots = iconHelper.buildSocialRowOutlineDots(doc, data);
      var gradientAccentPanel = iconHelper.buildGradientAccentPanel(data);
      var splitCurvePanel = iconHelper.buildSplitCurvePanel(data);
      var socialRowLarge = iconHelper.buildSocialRow(doc, data, 'circle-large', 'horizontal');
      var socialRowOutlineLight = iconHelper.buildSocialRow(doc, data, 'circle-outline-light', 'horizontal');
      var socialRowOutlineMedium = iconHelper.buildSocialRow(doc, data, 'circle-outline-medium', 'horizontal');
      var socialRowOutlineXl = iconHelper.buildSocialRow(doc, data, 'circle-outline-xl', 'horizontal');
      var socialRowLargeCentered = iconHelper.buildSocialRowCentered(doc, data, 'circle-large');
      var socialRowLargeVertical = iconHelper.buildSocialRowVerticalColumns(doc, data, 'circle-large', 3);
      var profileStackContactBlock = iconHelper.buildProfileStackContactBlock(doc, data);

      return {
        '{{name}}': escapeHtml(data.name),
        '{{nameUppercase}}': escapeHtml(data.name).toUpperCase(),
        '{{title}}': escapeHtml(data.title),
        '{{titleUppercase}}': escapeHtml(data.title).toUpperCase(),
        '{{companyNameUppercase}}': escapeHtml(data.companyName || '').toUpperCase(),
        '{{email}}': escapeHtml(data.email),
        '{{website}}': escapeHtml(displayWebsite(data.website)),
        '{{websiteUrl}}': escapeHtml(normalizeUrl(data.website)),
        '{{phone}}': escapeHtml(data.phone),
        '{{address}}': escapeHtml(data.address),
        '{{companyName}}': escapeHtml(data.companyName),
        '{{companyBrandLine1}}': escapeHtml(companyBrand.line1),
        '{{companyBrandLine2}}': escapeHtml(companyBrand.line2),
        '{{companyBrandLine2Block}}': companyBrandLine2Block,
        '{{companyJewelryDivider}}': companyJewelryDivider,
        '{{tagline}}': escapeHtml(data.tagline),
        '{{otherInfo}}': escapeHtml(data.otherInfo),
        '{{accentColor}}': escapeHtml(accent),
        '{{accentDark}}': escapeHtml(accentDark),
        '{{secondaryColor}}': escapeHtml(secondary),
        '{{fontName}}': FONTS.name,
        '{{fontBody}}': FONTS.body,
        '{{fontContact}}': FONTS.contact,
        '{{profileImage}}': profileImg,
        '{{profileImageLarge}}': profileImgLarge,
        '{{profileImageMedium}}': profileImgMedium,
        '{{profileImageCard}}': profileImgCard,
        '{{profileImageLuxury}}': profileImgLuxury,
        '{{luxuryHeroImage}}': luxuryHeroImage,
        '{{luxuryHeroBlock}}': luxuryHeroBlock,
        '{{profileImageSmall}}': profileSmall,
        '{{profileImageStack}}': profileImageStack,
        '{{logoImage}}': logoImg,
        '{{logoImageBranding}}': logoImgBranding,
        '{{logoImageBrandingElegant}}': logoImgBrandingElegant,
        '{{logoImageBrandingLetterhead}}': logoImgBrandingLetterhead,
        '{{logoImageCentered}}': logoImgCentered,
        '{{logoImageDecor}}': logoImgDecor,
        '{{logoImageLarge}}': logoImgLarge,
        '{{logoOnWhite}}': logoOnWhite,
        '{{gradientAccentPanel}}': gradientAccentPanel,
        '{{splitCurvePanel}}': splitCurvePanel,
        '{{socialRow}}': iconHelper.buildSocialRow(doc, data, 'circle', 'horizontal'),
        '{{socialRowLarge}}': socialRowLarge,
        '{{socialRowLargeCentered}}': socialRowLargeCentered,
        '{{socialRowLargeVertical}}': socialRowLargeVertical,
        '{{socialRowOutlineLight}}': socialRowOutlineLight,
        '{{socialRowOutlineMedium}}': socialRowOutlineMedium,
        '{{socialRowOutlineXl}}': socialRowOutlineXl,
        '{{socialRowOutlineDots}}': socialRowOutlineDots,
        '{{socialRowSquare}}': iconHelper.buildSocialRow(doc, data, 'square', 'horizontal'),
        '{{socialRowPlain}}': iconHelper.buildSocialRow(doc, data, 'plain', 'horizontal'),
        '{{socialRowLight}}': iconHelper.buildSocialRow(doc, data, 'square-light', 'horizontal'),
        '{{socialRowSoft}}': iconHelper.buildSocialRow(doc, data, 'soft-circle', 'horizontal'),
        '{{socialRowOutline}}': iconHelper.buildSocialRow(doc, data, 'outline', 'horizontal'),
        '{{socialRowOutlineAccent}}': iconHelper.buildSocialRow(doc, data, 'circle-outline', 'horizontal'),
        '{{socialRowCompact}}': iconHelper.buildSocialRow(doc, data, 'compact', 'horizontal'),
        '{{socialRowVertical}}': iconHelper.buildSocialRow(doc, data, 'circle', 'vertical'),
        '{{socialRowPlainVert}}': iconHelper.buildSocialRow(doc, data, 'plain', 'vertical'),
        '{{socialRowSoftVert}}': iconHelper.buildSocialRow(doc, data, 'soft-circle', 'vertical'),
        '{{contactBlock}}': contactRows,
        '{{contactBlockTwoCol}}': iconHelper.buildContactTwoCol(doc, data),
        '{{contactBlockGrid}}': iconHelper.buildContactGrid(doc, data),
        '{{contactBlockCircle}}': iconHelper.buildContactCircle(doc, data),
        '{{contactBlockDark}}': iconHelper.buildContactDark(doc, data),
        '{{verticalCardContactBlock}}': verticalCardContactBlock,
        '{{modernMinimalContactBlock}}': modernMinimalContactBlock,
        '{{cardContactBlock}}': cardContactBlock,
        '{{elegantCardContactBlock}}': elegantCardContactBlock,
        '{{luxuryContactBlock}}': luxuryContactBlock,
        '{{centeredContactBox}}': centeredContactBox,
        '{{profileStackContactBlock}}': profileStackContactBlock,
        '{{luxuryPanelContactBlock}}': luxuryPanelContactBlock,
        '{{contactInline}}': contactInline.join(' &nbsp;|&nbsp; '),
        '{{taglineBlock}}': taglineBlock,
        '{{otherBlock}}': otherBlock,
        '{{companyBlock}}': companyBlock
      };
    },

    /**
     * Strip elements with data-esg-if when field empty
     */
    applyConditionals: function (html, data) {
      var parser = new DOMParser();
      var doc = parser.parseFromString('<div id="wrap">' + html + '</div>', 'text/html');
      var wrap = doc.getElementById('wrap');
      if (!wrap) return html;
      var nodes = wrap.querySelectorAll('[data-esg-if]');
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var field = node.getAttribute('data-esg-if');
        var val = data[field];
        if (!val) {
          node.parentNode.removeChild(node);
        } else {
          node.removeAttribute('data-esg-if');
        }
      }
      return wrap.innerHTML;
    },

    /**
     * Render a signature template by id
     */
    render: function (doc, templateId, data) {
      var tpl = doc.getElementById(templateId);
      if (!tpl) return '';
      var html = tpl.innerHTML;
      var tokens = this.buildTokens(doc, data);
      var keys = Object.keys(tokens);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        html = html.split(key).join(tokens[key]);
      }
      html = this.applyConditionals(html, data);
      return html;
    },

    getTemplateName: function (doc, templateId) {
      var tpl = doc.getElementById(templateId);
      return tpl ? tpl.getAttribute('data-name') || templateId : templateId;
    }
  };

  var svgToPng = {
    /**
     * Rasterize SVG string to base64 PNG img tag
     */
    svgElementToPngImg: function (svgEl, scale) {
      scale = scale || 2;
      return new Promise(function (resolve) {
        var svg = svgEl.cloneNode(true);
        var w = parseInt(svg.getAttribute('width') || 20, 10);
        var h = parseInt(svg.getAttribute('height') || 20, 10);
        var serializer = new XMLSerializer();
        var str = serializer.serializeToString(svg);
        var blob = new Blob([str], { type: 'image/svg+xml;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var img = new Image();
        img.onload = function () {
          var canvas = document.createElement('canvas');
          canvas.width = w * scale;
          canvas.height = h * scale;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);
          var dataUrl = canvas.toDataURL('image/png');
          var alt = svg.getAttribute('data-icon') || 'icon';
          resolve(
            '<img src="' +
              dataUrl +
              '" alt="' +
              alt +
              '" width="' +
              w +
              '" height="' +
              h +
              '" style="border:0;display:inline-block;vertical-align:middle;" />'
          );
        };
        img.onerror = function () {
          URL.revokeObjectURL(url);
          resolve(svgEl.outerHTML);
        };
        img.src = url;
      });
    },

    svgImageToPngImg: function (imgEl, scale) {
      scale = scale || 2;
      return new Promise(function (resolve) {
        var w = parseInt(imgEl.getAttribute('width') || imgEl.width || 20, 10);
        var h = parseInt(imgEl.getAttribute('height') || imgEl.height || 20, 10);
        var img = new Image();
        img.onload = function () {
          try {
            var canvas = document.createElement('canvas');
            canvas.width = w * scale;
            canvas.height = h * scale;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            var dataUrl = canvas.toDataURL('image/png');
            resolve(
              '<img src="' +
                dataUrl +
                '" alt="' +
                escapeHtml(imgEl.getAttribute('alt') || '') +
                '" width="' +
                w +
                '" height="' +
                h +
                '" style="' +
                escapeHtml(imgEl.getAttribute('style') || 'border:0;display:block;') +
                '" />'
            );
          } catch (e) {
            resolve(imgEl.outerHTML);
          }
        };
        img.onerror = function () {
          resolve(imgEl.outerHTML);
        };
        img.src = imgEl.getAttribute('src');
      });
    },

    replaceAll: function (html) {
      var parser = new DOMParser();
      var doc = parser.parseFromString('<div id="root">' + html + '</div>', 'text/html');
      var root = doc.getElementById('root');
      if (!root) return html;
      var svgs = root.querySelectorAll('svg[data-icon]');
      var svgImgs = root.querySelectorAll('img[src^="data:image/svg+xml"]');
      var promises = [];
      var elements = [];
      for (var i = 0; i < svgs.length; i++) {
        elements.push(svgs[i]);
        promises.push(this.svgElementToPngImg(svgs[i], 2));
      }
      for (var k = 0; k < svgImgs.length; k++) {
        elements.push(svgImgs[k]);
        promises.push(this.svgImageToPngImg(svgImgs[k], 2));
      }
      return Promise.all(promises).then(function (imgs) {
        for (var j = 0; j < elements.length; j++) {
          var span = document.createElement('span');
          span.innerHTML = imgs[j];
          elements[j].parentNode.replaceChild(span.firstChild, elements[j]);
        }
        return root.innerHTML;
      });
    }
  };

  var clipboardHelper = {
    write: function (text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }
      return new Promise(function (resolve, reject) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          resolve();
        } catch (e) {
          reject(e);
        }
        document.body.removeChild(ta);
      });
    }
  };

  var buildAiPrompt = {
    annotate: function (html) {
      var annotated = html;
      annotated = annotated.replace(
        /(<img[^>]*alt="[^"]*"[^>]*width="96"[^>]*>)/i,
        '<!-- USER_IMAGE_START: profile photo 96x96 -->\n$1\n<!-- USER_IMAGE_END -->'
      );
      annotated = annotated.replace(
        /(<img[^>]*width="120"[^>]*height="48"[^>]*>)/i,
        '<!-- LOGO_START: company logo -->\n$1\n<!-- LOGO_END -->'
      );
      if (annotated.indexOf('USER_IMAGE_START') === -1 && html.indexOf('profileImage') === -1) {
        annotated = '<!-- USER_IMAGE_START -->\n(none)\n<!-- USER_IMAGE_END -->\n' + annotated;
      }
      return annotated;
    },

    build: function (data, templateName, renderedHtml) {
      var lines = [];
      lines.push('# HTML Email Signature — Edit Request');
      lines.push('');
      lines.push('## Purpose');
      lines.push(
        'Modify this professional HTML email signature while keeping email-client compatibility (table layout, inline CSS only, no external assets).'
      );
      lines.push('');
      lines.push('## Template');
      lines.push('- Name: ' + templateName);
      lines.push('');
      lines.push('## User details');
      var fields = [
        'name',
        'title',
        'email',
        'website',
        'phone',
        'address',
        'companyName',
        'tagline',
        'otherInfo',
        'linkedin',
        'youtube',
        'facebook',
        'instagram',
        'twitter',
        'pinterest',
        'accentColor'
      ];
      for (var i = 0; i < fields.length; i++) {
        var f = fields[i];
        if (data[f]) lines.push('- ' + f + ': ' + data[f]);
      }
      lines.push('');
      lines.push('## Design constraints');
      lines.push('- Accent color: ' + data.accentColor);
      lines.push('- Secondary color: auto-derived lighter shade of accent');
      lines.push('- Keep section markers intact (USER_IMAGE, LOGO, CONTACT_BLOCK, SOCIAL_ICONS, ACCENT_ELEMENTS)');
      lines.push('- Icons should use base64 PNG img tags for email clients');
      lines.push('- Max width 600px; table-based layout only');
      lines.push('');
      lines.push('## HTML (annotated)');
      lines.push('');
      var body = this.annotate(renderedHtml);
      body = '<!-- CONTACT_BLOCK_START -->\n' + body + '\n<!-- CONTACT_BLOCK_END -->';
      body = body.replace(
        new RegExp(escapeHtml(data.accentColor).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        function () {
          return '<!-- ACCENT_ELEMENTS -->' + data.accentColor + '<!-- /ACCENT -->';
        }
      );
      lines.push(body);
      lines.push('');
      lines.push('<!-- SOCIAL_ICONS_START: linkedin, youtube, facebook, instagram, twitter, pinterest -->');
      lines.push('<!-- SOCIAL_ICONS_END -->');
      lines.push('');
      lines.push('## Request');
      lines.push('[Describe your design changes here]');
      return lines.join('\n');
    }
  };

  var COPY_BTN_ICON =
    '<span class="esg-btn__icon" aria-hidden="true">' +
    '<svg viewBox="0 0 24 24" width="14" height="14">' +
    '<path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>' +
    '</svg></span>';

  var gallery = {
    render: function (root, doc, data) {
      var container = root.querySelector('[data-esg-gallery]');
      if (!container) return;
      container.innerHTML = '';
      var empty = root.querySelector('[data-esg-gallery-empty]');
      if (empty) empty.style.display = 'none';

      for (var i = 0; i < TEMPLATE_IDS.length; i++) {
        var id = TEMPLATE_IDS[i];
        var html = templateEngine.render(doc, id, data);
        var name = templateEngine.getTemplateName(doc, id);
        var card = document.createElement('article');
        card.className = 'esg-card';
        card.setAttribute('data-esg-template-id', id);

        var header = document.createElement('div');
        header.className = 'esg-card__header';
        var titleHtml = '<span class="esg-card__name">' + escapeHtml(name) + '</span>';
        header.innerHTML =
          '<div class="esg-card__title">' +
          titleHtml +
          '</div><div class="esg-card__actions">' +
          '<button type="button" class="esg-btn esg-btn--sm" data-esg-copy="html" title="Copy HTML">' +
          COPY_BTN_ICON +
          '<span class="esg-btn__label">Copy HTML</span></button>' +
          '<button type="button" class="esg-btn esg-btn--sm" data-esg-copy="prompt" title="Copy AI prompt">' +
          COPY_BTN_ICON +
          '<span class="esg-btn__label">Copy Prompt</span></button>' +
          '</div>';

        var preview = document.createElement('div');
        preview.className = 'esg-card__preview';
        preview.innerHTML = html;

        card.appendChild(header);
        card.appendChild(preview);
        container.appendChild(card);

        card.setAttribute('data-esg-rendered-html', html);
        card.setAttribute('data-esg-template-name', name);
      }
    },

    /** Event delegation for copy buttons — bound once in init */
    handleCopyClick: function (e, root, doc) {
      var btn = e.target.closest('[data-esg-copy]');
      if (!btn) return;
      var card = btn.closest('.esg-card');
      if (!card) return;
      var mode = btn.getAttribute('data-esg-copy');
      var rendered = card.getAttribute('data-esg-rendered-html') || '';
      var tName = card.getAttribute('data-esg-template-name') || '';
      var data = formState.read(root);
      var accentPicker = root.querySelector('[data-esg-field="accentColor"]');
      if (accentPicker) data.accentColor = accentPicker.value;

      if (mode === 'html') {
        svgToPng.replaceAll(rendered).then(function (safe) {
          return clipboardHelper.write(safe);
        }).then(function () {
          gallery.showCopied(btn, 'Copied');
        }).catch(function () {
          gallery.showCopied(btn, 'Failed');
        });
      } else if (mode === 'prompt') {
        var prompt = buildAiPrompt.build(data, tName, rendered);
        clipboardHelper.write(prompt).then(function () {
          gallery.showCopied(btn, 'Copied');
        });
      }
    },

    showCopied: function (btn, text) {
      var label = btn.querySelector('.esg-btn__label');
      var orig = label ? label.textContent : btn.textContent;
      if (label) label.textContent = text;
      else btn.textContent = text;
      btn.classList.add('esg-copied');
      setTimeout(function () {
        if (label) label.textContent = orig;
        else btn.textContent = orig;
        btn.classList.remove('esg-copied');
      }, 2000);
    }
  };

  var EmailSignatureApp = {
    init: function (options) {
      options = options || {};
      var doc = options.doc || document;
      var root =
        typeof options.root === 'string'
          ? doc.querySelector(options.root)
          : options.root || doc.getElementById('esg-app');

      if (!root) {
        console.error('EmailSignatureApp: root element not found');
        return;
      }

      var profileInput = root.querySelector('[data-esg-upload="profile"]');
      var logoInput = root.querySelector('[data-esg-upload="logo"]');
      var profileRemove = root.querySelector('[data-esg-remove="profile"]');
      var logoRemove = root.querySelector('[data-esg-remove="logo"]');
      var generateBtn = root.querySelector('[data-esg-generate]');
      var errorEl = root.querySelector('[data-esg-error]');
      var accentPicker = root.querySelector('[data-esg-field="accentColor"]');
      var accentText = root.querySelector('[data-esg-field="accentColorText"]');

      function refreshGalleryIfVisible() {
        var galleryEl = root.querySelector('[data-esg-gallery]');
        if (!galleryEl || !galleryEl.children.length) return;
        var data = formState.read(root);
        if (accentPicker) data.accentColor = accentPicker.value;
        gallery.render(root, doc, data);
      }

      function syncAccentUi(color) {
        document.documentElement.style.setProperty('--esg-accent', color);
      }

      if (accentPicker && accentText) {
        accentPicker.addEventListener('input', function () {
          accentText.value = accentPicker.value;
          syncAccentUi(accentPicker.value);
        });
        accentText.addEventListener('input', function () {
          if (/^#[0-9A-Fa-f]{6}$/.test(accentText.value)) {
            accentPicker.value = accentText.value;
            syncAccentUi(accentText.value);
          }
        });
      }

      var presets = root.querySelector('[data-esg-presets]');
      if (presets) {
        presets.addEventListener('click', function (e) {
          var swatch = e.target.closest('[data-color]');
          if (!swatch) return;
          var color = swatch.getAttribute('data-color');
          if (accentPicker) accentPicker.value = color;
          if (accentText) accentText.value = color;
          syncAccentUi(color);
          var all = presets.querySelectorAll('.esg-swatch');
          for (var s = 0; s < all.length; s++) {
            all[s].classList.remove('esg-active');
          }
          swatch.classList.add('esg-active');
        });
      }

      if (profileInput) {
        profileInput.addEventListener('change', function () {
          var file = profileInput.files[0];
          if (!file) return;
          imageProcessor.process(file, 110, 110, 2).then(function (dataUrl) {
            mediaUi.setImage(root, 'profile', dataUrl);
            refreshGalleryIfVisible();
          }).catch(function (err) {
            alert(err.message);
          });
        });
      }

      if (logoInput) {
        logoInput.addEventListener('change', function () {
          var file = logoInput.files[0];
          if (!file) return;
          imageProcessor.process(file, 200, 80, 2).then(function (dataUrl) {
            mediaUi.setImage(root, 'logo', dataUrl);
            refreshGalleryIfVisible();
          }).catch(function (err) {
            alert(err.message);
          });
        });
      }

      if (profileRemove) {
        profileRemove.addEventListener('click', function () {
          mediaUi.clearImage(root, 'profile');
          refreshGalleryIfVisible();
        });
      }

      if (logoRemove) {
        logoRemove.addEventListener('click', function () {
          mediaUi.clearImage(root, 'logo');
          refreshGalleryIfVisible();
        });
      }

      var galleryEl = root.querySelector('[data-esg-gallery]');
      if (galleryEl && !galleryEl.getAttribute('data-esg-bound')) {
        galleryEl.setAttribute('data-esg-bound', '1');
        galleryEl.addEventListener('click', function (e) {
          gallery.handleCopyClick(e, root, doc);
        });
      }

      if (generateBtn) {
        generateBtn.addEventListener('click', function () {
          var data = formState.read(root);
          if (accentPicker) data.accentColor = accentPicker.value;
          if (errorEl) errorEl.classList.remove('esg-visible');
          gallery.render(root, doc, data);
        });
      }

      if (options.demo) {
        demoData.load(root, doc, {
          autoGenerate: options.autoGenerate !== false,
          profileUrl: options.profileUrl,
          logoUrl: options.logoUrl,
          demoData: options.demoData
        }).catch(function (err) {
          console.warn('Demo image load failed:', err.message);
        });
      }
    }
  };

  global.EmailSignatureApp = EmailSignatureApp;
})(typeof window !== 'undefined' ? window : this);
