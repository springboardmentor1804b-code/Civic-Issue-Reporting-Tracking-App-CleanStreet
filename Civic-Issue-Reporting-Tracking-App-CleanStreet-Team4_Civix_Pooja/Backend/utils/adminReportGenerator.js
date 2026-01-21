import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const section = (doc, title, y) => {
  if (y + 40 > doc.page.height - 60) {
    doc.addPage();
    y = 40;
  }

  doc.fontSize(18).fillColor('#1e3a8a').text(title, 40, y, { width: 520 });

  return y + 30;
};

const table = (doc, y, cols, rows) => {
  const startX = 40;
  const rowH = 28;
  const pageBottom = doc.page.height - 60;
  const tableW = cols.reduce((s, c) => s + c.w, 0);

  const drawHeader = yPos => {
    doc.rect(startX, yPos, tableW, rowH).fill('#e0f2fe');
    let x = startX;
    cols.forEach(c => {
      doc
        .fontSize(11)
        .fillColor('#0f172a')
        .text(c.h, x + 6, yPos + 8, { width: c.w - 12, lineBreak: false });
      x += c.w;
    });
    return yPos + rowH;
  };

  y = drawHeader(y);

  rows.forEach((row, i) => {
    if (y + rowH > pageBottom) {
      doc.addPage();
      y = drawHeader(40);
    }

    doc.rect(startX, y, tableW, rowH).fill(i % 2 === 0 ? '#f8fafc' : '#ffffff');

    let x = startX;
    cols.forEach(c => {
      doc
        .fontSize(10)
        .fillColor('#0f172a')
        .text(String(row[c.k] ?? ''), x + 6, y + 7, { width: c.w - 12, ellipsis: true });
      x += c.w;
    });

    y += rowH;
  });

  return y + 20;
};

export const generateAdminReport = async ({ issues, users }) => {
  const dir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const file = path.join(dir, `admin-report-${Date.now()}.pdf`);
  const doc = new PDFDocument({ margin: 40 });
  const stream = fs.createWriteStream(file);
  doc.pipe(stream);

  const now = new Date();

  doc
    .fontSize(36)
    .fillColor('#0f172a')
    .text('Issue Analytics Report', 40, doc.page.height / 2 - 50, { align: 'center', width: 520 });

  doc
    .fontSize(12)
    .fillColor('#334155')
    .text(`Generated on ${now.toLocaleString()}`, 40, doc.page.height / 2 + 10, {
      align: 'center',
      width: 520,
    });

  doc.addPage();
  let y = 40;

  const total = issues.length;
  const received = issues.filter(i => i.status === 'received');
  const inProgress = issues.filter(i => i.status === 'in-progress');
  const resolved = issues.filter(i => i.status === 'resolved');

  y = section(doc, 'Operational Overview', y);
  y = table(
    doc,
    y,
    [
      { h: 'Status', k: 's', w: 200 },
      { h: 'Count', k: 'c', w: 120 },
      { h: 'Percentage', k: 'p', w: 200 },
    ],
    [
      { s: 'Received', c: received.length, p: `${((received.length / total) * 100).toFixed(1)}%` },
      {
        s: 'In Progress',
        c: inProgress.length,
        p: `${((inProgress.length / total) * 100).toFixed(1)}%`,
      },
      { s: 'Resolved', c: resolved.length, p: `${((resolved.length / total) * 100).toFixed(1)}%` },
    ]
  );

  y = section(doc, 'Unassigned Issues Alert', y);
  y = table(
    doc,
    y,
    [
      { h: 'Type', k: 't', w: 150 },
      { h: 'Priority', k: 'p', w: 120 },
      { h: 'Location', k: 'l', w: 250 },
      { h: 'Created', k: 'd', w: 120 },
    ],
    received
      .filter(i => !i.assignedTo)
      .map(i => ({
        t: i.issueType,
        p: i.priority || 'Normal',
        l: i.address || 'N/A',
        d: new Date(i.createdAt).toLocaleDateString(),
      }))
  );

  y = section(doc, 'High Priority Incident Report', y);
  y = table(
    doc,
    y,
    [
      { h: 'Type', k: 't', w: 200 },
      { h: 'Location', k: 'l', w: 260 },
      { h: 'Status', k: 's', w: 100 },
    ],
    issues
      .filter(i => i.priority === 'High')
      .map(i => ({
        t: i.issueType,
        l: i.address || 'N/A',
        s: i.status,
      }))
  );

  doc.addPage();
  y = 40;

  y = section(doc, 'Issue Type Breakdown', y);
  const typeMap = {};
  issues.forEach(i => (typeMap[i.issueType] = (typeMap[i.issueType] || 0) + 1));

  y = table(
    doc,
    y,
    [
      { h: 'Issue Type', k: 't', w: 260 },
      { h: 'Count', k: 'c', w: 120 },
      { h: 'Share', k: 'p', w: 140 },
    ],
    Object.entries(typeMap).map(([t, c]) => ({
      t,
      c,
      p: `${((c / total) * 100).toFixed(1)}%`,
    }))
  );

  y = section(doc, 'Location Hotspots', y);
  const locMap = {};
  issues.forEach(i => i.address && (locMap[i.address] = (locMap[i.address] || 0) + 1));

  y = table(
    doc,
    y,
    [
      { h: 'Location', k: 'l', w: 360 },
      { h: 'Issues', k: 'c', w: 160 },
    ],
    Object.entries(locMap)
      .filter(([, c]) => c > 1)
      .map(([l, c]) => ({ l, c }))
  );

  doc.addPage();
  y = 40;

  y = section(doc, 'Performance & Efficiency', y);
  const responseTimes = issues
    .filter(i => i.acceptedAt)
    .map(i => (new Date(i.acceptedAt) - new Date(i.createdAt)) / 86400000);

  const avgResponse = responseTimes.length
    ? (responseTimes.reduce((a, b) => a + b) / responseTimes.length).toFixed(2)
    : 'N/A';

  y = table(
    doc,
    y,
    [
      { h: 'Metric', k: 'm', w: 300 },
      { h: 'Value', k: 'v', w: 220 },
    ],
    [
      { m: 'Average Response Time (days)', v: avgResponse },
      { m: 'Total Issues Analyzed', v: total },
    ]
  );

  y = section(doc, 'Stale Issues Report (>7 days)', y);
  y = table(
    doc,
    y,
    [
      { h: 'Type', k: 't', w: 200 },
      { h: 'Location', k: 'l', w: 260 },
      { h: 'Age (days)', k: 'a', w: 100 },
    ],
    received
      .filter(i => (now - new Date(i.createdAt)) / 86400000 > 7)
      .map(i => ({
        t: i.issueType,
        l: i.address || 'N/A',
        a: Math.floor((now - new Date(i.createdAt)) / 86400000),
      }))
  );

  doc.addPage();
  y = 40;

  y = section(doc, 'Workload Distribution', y);
  const workload = {};
  issues.forEach(i => {
    if (i.assignedTo?.name) {
      workload[i.assignedTo.name] = (workload[i.assignedTo.name] || 0) + 1;
    }
  });

  y = table(
    doc,
    y,
    [
      { h: 'Staff / Volunteer', k: 'n', w: 260 },
      { h: 'Active Issues', k: 'c', w: 120 },
      { h: 'Load Status', k: 'l', w: 160 },
    ],
    Object.entries(workload).map(([n, c]) => ({
      n,
      c,
      l: c > 6 ? 'OVERLOADED' : c >= 3 ? 'BALANCED' : 'UNDERUTILIZED',
    }))
  );

  y = section(doc, 'Duplicate Issue Audit Report', y);
  const duplicates = [];

  for (let i = 0; i < issues.length; i++) {
    for (let j = i + 1; j < issues.length; j++) {
      const a = issues[i];
      const b = issues[j];
      if (
        a.address &&
        a.address === b.address &&
        a.issueType === b.issueType &&
        Math.abs(new Date(a.createdAt) - new Date(b.createdAt)) < 120000
      ) {
        duplicates.push({
          t: a.issueType,
          l: a.address,
          g: `${Math.abs((new Date(a.createdAt) - new Date(b.createdAt)) / 1000).toFixed(1)} sec`,
        });
      }
    }
  }

  if (duplicates.length === 0) {
    doc.fontSize(11).text('No potential duplicate issues detected.', 40, y);
  } else {
    y = table(
      doc,
      y,
      [
        { h: 'Issue Type', k: 't', w: 200 },
        { h: 'Location', k: 'l', w: 260 },
        { h: 'Time Gap', k: 'g', w: 120 },
      ],
      duplicates
    );
  }

  doc.end();
  await new Promise(r => stream.on('finish', r));
  return file;
};
