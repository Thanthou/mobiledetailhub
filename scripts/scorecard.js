#!/usr/bin/env node
/**
 * Developer Scorecard — Simple Mode (v5)
 * Tracks git productivity by net lines (insertions - deletions).
 * Weekly and total averages are weighted by total lines, not daily averages.
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import Table from "cli-table3";

// --- Settings ---
const DAILY_TARGET = 3500;          // lines/day = 100 DPV
const MAX_LINES_PER_DAY = 10000;    // cap extreme days

// --- Parse git log ---
function getGitHistory() {
  const logCmd = `git log --pretty=format:"%ad|%s" --date=short --shortstat --no-merges`;
  const raw = execSync(logCmd, { encoding: "utf-8" });
  const lines = raw.split("\n").filter(Boolean);

  const data = [];
  let current = null;
  for (const line of lines) {
    if (line.includes("|") && !line.includes("files changed")) {
      const [date, message] = line.split("|");
      current = { date: date.trim(), message: message.trim(), insertions: 0, deletions: 0 };
    } else if (line.includes("file") && current) {
      const addMatch = line.match(/(\d+) insertions?/);
      const delMatch = line.match(/(\d+) deletions?/);
      current.insertions += addMatch ? +addMatch[1] : 0;
      current.deletions += delMatch ? +delMatch[1] : 0;
      data.push(current);
      current = null;
    }
  }
  return data;
}

// --- Grading ---
function getGrade(dpv) {
  if (dpv >= 95) return "A+";
  if (dpv >= 90) return "A";
  if (dpv >= 85) return "B+";
  if (dpv >= 80) return "B";
  if (dpv >= 75) return "C+";
  if (dpv >= 70) return "C";
  if (dpv >= 60) return "D";
  return "F";
}

function colorByGrade(grade) {
  if (grade === "A+" || grade === "A") return chalk.green;
  if (grade === "B" || grade === "B+") return chalk.cyan;
  if (grade === "C" || grade === "C+") return chalk.yellow;
  if (grade === "D") return chalk.hex("#A0522D"); // brown
  if (grade === "F") return chalk.red;
  return chalk.gray;
}

// --- Week number helper ---
function getWeekNumber(date) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstDay) / 86400000);
  return Math.ceil((days + firstDay.getDay() + 1) / 7);
}

// --- Main analysis ---
function analyzeHistory() {
  const commits = getGitHistory();

  // Aggregate daily
  const byDate = {};
  for (const c of commits) {
    const key = c.date;
    if (!byDate[key]) byDate[key] = { commits: 0, lines: 0 };
    byDate[key].commits++;
    const net = Math.max(0, c.insertions - c.deletions);
    byDate[key].lines += Math.min(net, MAX_LINES_PER_DAY);
  }

  const days = Object.entries(byDate)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, val]) => {
      const dpv =
        val.lines === 0 ? 0 : Math.min(100, Math.round((val.lines / DAILY_TARGET) * 100));
      const grade = val.lines === 0 ? "—" : getGrade(dpv);
      return { date, commits: val.commits, lines: val.lines, dpv, grade };
    });

  // Group by week
  const validDays = days.filter((d) => d.lines > 0);
  const weeks = {};
  for (const d of validDays) {
    const week = getWeekNumber(new Date(d.date));
    if (!weeks[week]) weeks[week] = [];
    weeks[week].push(d);
  }

  const weekSummaries = Object.entries(weeks).map(([week, arr]) => {
    const totalLines = arr.reduce((s, d) => s + d.lines, 0);
    // Detect if this is the current (active) week
    const now = new Date();
    const currentWeekNum = getWeekNumber(now);
    const isCurrentWeek = Number(week) === currentWeekNum;

    // If current week, use real worked days; else assume 5
    const totalDays = isCurrentWeek ? arr.length : 5;

    const avgDPV = Math.min(
      100,
      Math.round(((totalLines / totalDays) / DAILY_TARGET) * 100)
    );

    const grade = getGrade(avgDPV);

    return { week: `Week ${week}`, dpv: avgDPV, grade, lines: totalLines };
  });

  render(days, weekSummaries);
}

// --- Render table ---
function render(days, weekSummaries) {
  console.log(chalk.cyan("📅  Developer Scorecard — Lines Added/Deleted (Simple Mode v5)"));

  const table = new Table({
    head: [chalk.gray("Date"), "Commits", "Lines", "DPV", "Grade"],
    colWidths: [14, 10, 12, 8, 8],
    style: { head: [], border: [] },
  });

  for (const d of days) {
    const week = getWeekNumber(new Date(d.date));
    const color = colorByGrade(d.grade);
    table.push([
      color(d.date),
      color(d.commits),
      color(d.lines.toLocaleString()),
      color(d.dpv || "—"),
      color(d.grade),
    ]);

    // Week summary
    const nextDay = days.find((x) => new Date(x.date) > new Date(d.date));
    const nextWeek = nextDay ? getWeekNumber(new Date(nextDay.date)) : null;
    if (nextWeek !== week) {
      const ws = weekSummaries.find((w) => w.week === `Week ${week}`);
      if (ws) {
        const wColor = colorByGrade(ws.grade);
        table.push([
          wColor.bold(ws.week),
          "—",
          wColor(ws.lines.toLocaleString()),
          wColor(ws.dpv),
          wColor(ws.grade),
        ]);
        table.push(["", "", "", "", ""]); // spacer
      }
    }
  }

  console.log(table.toString());

  // Weighted total average
  const avgDPV =
  weekSummaries.length > 0
    ? Math.round(
        weekSummaries.reduce((sum, w) => sum + w.dpv, 0) / weekSummaries.length
      )
    : 0;
  const grade = getGrade(avgDPV);
  console.log(chalk.gray(`Average DPV (recent): ${avgDPV} → ${grade}`));

  // Save CSV
  const csvPath = path.join("chatgpt", "gitlogs", "scorecard-history.csv");
  fs.mkdirSync(path.dirname(csvPath), { recursive: true });
  const csv =
    "date,commits,lines,dpv,grade\n" +
    days.map((d) => `${d.date},${d.commits},${d.lines},${d.dpv},${d.grade}`).join("\n");
  fs.writeFileSync(csvPath, csv);
  console.log(chalk.gray(`History saved to: ${csvPath}`));
}

// --- Run ---
analyzeHistory();
