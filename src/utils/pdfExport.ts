import { jsPDF } from 'jspdf';
import { TokenNode, ColorUnitMode } from './syllabifier';
import { FontFamilyOption, FONT_OPTIONS } from './palettes';

export interface PdfExportOptions {
  documentTitle: string;
  tokens: TokenNode[];
  fontFamily: FontFamilyOption;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
  unitMode: ColorUnitMode;
  paletteColors: string[];
  colorCount: number;
  customSyllableColors: Record<string, string>;
  showSyllableArcs: boolean;
  showLineWordCount: boolean;
  lineWordCountMode: 'cumulative' | 'line' | 'both';
  showSilentLetters: boolean;
  silentLetterColor: string;
}

interface PageLine {
  tokens: TokenNode[];
  wordCount: number;
  cumulativeWordCount: number;
}

/**
 * Generates and downloads a high-resolution, print-ready PDF of the reading sheet.
 * Uses native HTML5 2D Canvas rendering to avoid CSS stylesheet compatibility issues
 * (such as Tailwind v4 oklch / color-mix) and writes directly into jsPDF.
 */
export async function exportReadingSheetToPdf(options: PdfExportOptions): Promise<void> {
  // Ensure fonts are fully loaded before measuring and painting
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Continue even if font loading promise rejects
    }
  }

  const safeFilename =
    (options.documentTitle || 'fiche-de-lecture-syllabique')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9à-ÿ]+/gi, '-')
      .replace(/^-|-$/g, '') + '.pdf';

  const fontObj = FONT_OPTIONS.find((f) => f.id === options.fontFamily) || FONT_OPTIONS[0];

  // A4 proportions: 210mm x 297mm (ratio 1 : 1.4142)
  const canvasWidth = 1600;
  const pageHeight = 2263; // Math.round(1600 * 297 / 210)
  const marginLeft = 110;
  const marginRight = 110;
  const marginTop = 120;
  const marginBottom = 120;
  const gutterWidth = options.showLineWordCount ? 140 : 0;
  const usableTextWidth = canvasWidth - marginLeft - marginRight - gutterWidth;

  // Proportional scale factor between CSS pixel size on screen and A4 print canvas (1600px width)
  // options.fontSize range is 16px to 44px (default 24px).
  // Dynamically scales: 16px -> 30px, 24px -> 45px, 32px -> 60px, 44px -> 82px
  const canvasScale = 1.86;
  const canvasFontSize = Math.round(options.fontSize * canvasScale);

  // Line height is directly proportional to font size and options.lineHeight (1.4x to 3.2x)
  const lineHeightPx = Math.round(canvasFontSize * options.lineHeight);

  // Setup helper canvas for font measurement
  const measureCanvas = document.createElement('canvas');
  measureCanvas.width = canvasWidth;
  measureCanvas.height = 100;
  const mctx = measureCanvas.getContext('2d');
  if (!mctx) throw new Error('Impossible de créer le contexte 2D');

  const cssFontFamily = fontObj.cssFamily || 'Plus Jakarta Sans, sans-serif';
  const textFont = `${canvasFontSize}px ${cssFontFamily}`;
  mctx.font = textFont;

  // Apply letter-spacing and word-spacing to canvas context when supported
  const letterSpacingPx = `${(options.letterSpacing * canvasFontSize).toFixed(1)}px`;
  const wordSpacingPx = `${(options.wordSpacing * canvasFontSize).toFixed(1)}px`;
  if ('letterSpacing' in mctx) {
    (mctx as unknown as { letterSpacing: string }).letterSpacing = letterSpacingPx;
  }
  if ('wordSpacing' in mctx) {
    (mctx as unknown as { wordSpacing: string }).wordSpacing = wordSpacingPx;
  }

  // Group tokens into visual wrapped lines using accurate text measurement
  const lines: PageLine[] = [];
  let currentLineTokens: TokenNode[] = [];
  let currentLineWidth = 0;
  let currentLineWords = 0;
  let runningCumulative = 0;

  const pushCurrentLine = () => {
    runningCumulative += currentLineWords;
    lines.push({
      tokens: [...currentLineTokens],
      wordCount: currentLineWords,
      cumulativeWordCount: runningCumulative,
    });
    currentLineTokens = [];
    currentLineWidth = 0;
    currentLineWords = 0;
  };

  const measureTokenWidth = (token: TokenNode): number => {
    if (token.type === 'newline') return 0;
    if (token.type === 'separator') {
      return mctx.measureText(token.raw).width;
    }
    let w = 0;
    for (const syl of token.syllables) {
      if (options.showSilentLetters && syl.parts && syl.parts.length > 0) {
        for (const part of syl.parts) {
          w += mctx.measureText(part.text).width;
        }
      } else {
        w += mctx.measureText(syl.text).width;
      }
    }
    return w;
  };

  for (const token of options.tokens) {
    if (token.type === 'newline') {
      pushCurrentLine();
      continue;
    }

    const tWidth = measureTokenWidth(token);

    if (currentLineWidth + tWidth > usableTextWidth && currentLineTokens.length > 0) {
      pushCurrentLine();
    }

    currentLineTokens.push(token);
    currentLineWidth += tWidth;
    if (token.type === 'word') {
      currentLineWords++;
    }
  }

  if (currentLineTokens.length > 0 || lines.length === 0) {
    pushCurrentLine();
  }

  // Calculate lines per page based on current font size and line height
  const headerHeight = options.documentTitle.trim() ? 140 : 40;
  const usablePageContentHeight = pageHeight - marginTop - marginBottom - headerHeight;
  const linesPerPage = Math.max(1, Math.floor(usablePageContentHeight / lineHeightPx));
  const totalPages = Math.max(1, Math.ceil(lines.length / linesPerPage));

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
    if (pageIdx > 0) {
      pdf.addPage('a4', 'portrait');
    }

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = pageHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;

    // Crisp white background for print
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, pageHeight);

    let startY = marginTop;

    // Draw Title only on page 1 (or small header on later pages)
    if (pageIdx === 0 && options.documentTitle.trim()) {
      ctx.font = 'bold 40px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(options.documentTitle, marginLeft, startY + 36);

      // Divider line
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(marginLeft, startY + 60);
      ctx.lineTo(canvasWidth - marginRight, startY + 60);
      ctx.stroke();

      startY += headerHeight;
    } else if (pageIdx > 0 && options.documentTitle.trim()) {
      ctx.font = '16px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(
        `${options.documentTitle} — Page ${pageIdx + 1}/${totalPages}`,
        marginLeft,
        startY + 10
      );
      startY += 50;
    }

    // Draw lines for this page
    const pageLines = lines.slice(pageIdx * linesPerPage, (pageIdx + 1) * linesPerPage);
    let currentY = startY + canvasFontSize;

    for (const line of pageLines) {
      let currentX = marginLeft;
      ctx.font = textFont;
      ctx.textBaseline = 'alphabetic';
      if ('letterSpacing' in ctx) {
        (ctx as unknown as { letterSpacing: string }).letterSpacing = letterSpacingPx;
      }
      if ('wordSpacing' in ctx) {
        (ctx as unknown as { wordSpacing: string }).wordSpacing = wordSpacingPx;
      }

      for (const token of line.tokens) {
        if (token.type === 'newline') continue;

        if (token.type === 'separator') {
          const sepColor =
            options.unitMode === 'sentence'
              ? options.paletteColors[token.defaultColorIndex % options.colorCount] ||
                options.paletteColors[0]
              : '#0f172a';
          ctx.fillStyle = sepColor;
          ctx.fillText(token.raw, currentX, currentY);
          currentX += ctx.measureText(token.raw).width;
          continue;
        }

        // Token is word
        for (const syl of token.syllables) {
          const defaultHex =
            options.paletteColors[syl.defaultColorIndex % options.colorCount] ||
            options.paletteColors[0];
          const hexColor = options.customSyllableColors[syl.id] || defaultHex;
          const sylStartX = currentX;

          if (options.showSilentLetters && syl.parts && syl.parts.length > 0) {
            for (const part of syl.parts) {
              const partColor = part.isSilent ? options.silentLetterColor : hexColor;
              ctx.fillStyle = partColor;
              ctx.fillText(part.text, currentX, currentY);
              currentX += ctx.measureText(part.text).width;
            }
          } else {
            ctx.fillStyle = hexColor;
            ctx.fillText(syl.text, currentX, currentY);
            currentX += ctx.measureText(syl.text).width;
          }

          const sylEndX = currentX;

          // Draw syllable arc under syllable if enabled
          if (options.showSyllableArcs) {
            const arcWidth = sylEndX - sylStartX;
            const arcY = currentY + Math.max(5, Math.round(canvasFontSize * 0.15));
            ctx.strokeStyle = hexColor;
            ctx.lineWidth = Math.max(2, Math.round(canvasFontSize * 0.055));
            ctx.beginPath();
            ctx.moveTo(sylStartX + 2, arcY);
            ctx.quadraticCurveTo(
              sylStartX + arcWidth / 2,
              arcY + Math.max(6, Math.round(canvasFontSize * 0.15)),
              sylEndX - 2,
              arcY
            );
            ctx.stroke();
          }
        }
      }

      // Draw line word count badge in the right gutter
      if (options.showLineWordCount && line.wordCount > 0) {
        const badgeText =
          options.lineWordCountMode === 'line'
            ? `${line.wordCount} m.`
            : options.lineWordCountMode === 'cumulative'
            ? `${line.cumulativeWordCount}`
            : `${line.wordCount} · ${line.cumulativeWordCount}`;

        const badgeFontSize = Math.max(16, Math.round(canvasFontSize * 0.42));
        ctx.font = `bold ${badgeFontSize}px monospace`;
        if ('letterSpacing' in ctx) {
          (ctx as unknown as { letterSpacing: string }).letterSpacing = '0px';
        }
        if ('wordSpacing' in ctx) {
          (ctx as unknown as { wordSpacing: string }).wordSpacing = '0px';
        }

        const badgeMetrics = ctx.measureText(badgeText);
        const badgePaddingX = Math.round(badgeFontSize * 0.7);
        const badgeWidth = Math.max(48, Math.round(badgeMetrics.width + badgePaddingX * 2));
        const badgeHeight = Math.max(28, Math.round(canvasFontSize * 0.68));
        const badgeX = canvasWidth - marginRight - badgeWidth;
        const badgeY = Math.round(currentY - canvasFontSize * 0.82 + (lineHeightPx - badgeHeight) / 2);

        // Rounded badge background
        const radius = 6;
        ctx.fillStyle = '#f0f9ff';
        ctx.strokeStyle = '#bae6fd';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(badgeX + radius, badgeY);
        ctx.lineTo(badgeX + badgeWidth - radius, badgeY);
        ctx.quadraticCurveTo(badgeX + badgeWidth, badgeY, badgeX + badgeWidth, badgeY + radius);
        ctx.lineTo(badgeX + badgeWidth, badgeY + badgeHeight - radius);
        ctx.quadraticCurveTo(
          badgeX + badgeWidth,
          badgeY + badgeHeight,
          badgeX + badgeWidth - radius,
          badgeY + badgeHeight
        );
        ctx.lineTo(badgeX + radius, badgeY + badgeHeight);
        ctx.quadraticCurveTo(badgeX, badgeY + badgeHeight, badgeX, badgeY + badgeHeight - radius);
        ctx.lineTo(badgeX, badgeY + radius);
        ctx.quadraticCurveTo(badgeX, badgeY, badgeX + radius, badgeY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Badge text
        ctx.fillStyle = '#0284c7';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(badgeText, badgeX + badgeWidth / 2, badgeY + badgeHeight / 2);
        ctx.textAlign = 'left';

        // Restore body text font and spacing for next elements
        ctx.font = textFont;
        if ('letterSpacing' in ctx) {
          (ctx as unknown as { letterSpacing: string }).letterSpacing = letterSpacingPx;
        }
        if ('wordSpacing' in ctx) {
          (ctx as unknown as { wordSpacing: string }).wordSpacing = wordSpacingPx;
        }
      }

      currentY += lineHeightPx;
    }

    // Add page image to jsPDF
    const imgData = canvas.toDataURL('image/png', 1.0);
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
  }

  // Save the PDF
  pdf.save(safeFilename);
}
