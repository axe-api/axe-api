<script setup>
import { ref } from "vue";
import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";

dayjs.extend(quarterOfYear);

const LINE_HEIGHT = 48;

const releases = ref([
  {
    title: "v0.20",
    periods: [
      { title: "ACTIVE", start: 2022.75, end: 2023.5 },
      { title: "MAINTENANCE", start: 2023.5, end: 2024 },
    ],
  },
  {
    title: "v0.30",
    periods: [
      { title: "ACTIVE", start: 2023.25, end: 2024.25 },
      { title: "MAINTENANCE", start: 2024.25, end: 2024.75 },
    ],
  },
  {
    title: "v1",
    periods: [
      { title: "ACTIVE", start: 2024, end: 2026 },
      { title: "MAINTENANCE", start: 2026, end: 2027 },
    ],
  },
  // {
  //   title: "v2",
  //   periods: [
  //     { title: "ACTIVE", start: 2026, end: 2028.25 },
  //     { title: "MAINTENANCE", start: 2028.25, end: 2029 },
  //   ],
  // },
]);

const getStart = () => {
  return Math.floor(
    Math.min.apply(
      Math,
      releases.value
        .map((i) => i.periods)
        .flat()
        .map((i) => i.start),
    ),
  );
};

const getEnd = () => {
  const end = Math.ceil(
    Math.max.apply(
      Math,
      releases.value
        .map((i) => i.periods)
        .flat()
        .map((i) => i.end),
    ),
  );

  return end - 1;
};

const start = getStart();
const end = getEnd();
const currentYear = dayjs().year();
const currentQuarter = dayjs().quarter();
const currentYearAndQuarter = currentYear + 0.25 * (currentQuarter - 1);
const diff = end - start + 1;
const years = Array.from(Array(diff).keys());
const yearWidth = 100 / diff;
const quarterWidth = yearWidth / 4;

const getReleaseLeft = (period) => {
  const periodStart = period.start - start;
  return (100 * periodStart) / diff;
};

const getReleaseWidth = (period) => {
  const periodEnd = end - period.end + 1;
  const endingAt = 100 - (100 * periodEnd) / diff;
  const left = getReleaseLeft(period);
  return 100 - left - (100 - endingAt);
};

const getBGColor = (period) => {
  if (period.title === "ACTIVE") {
    if (period.end < currentYearAndQuarter) {
      return "#46497d";
    }

    return "#46497d";
  }

  if (period.title === "MAINTENANCE") {
    return "#282a2f";
  }

  // warning
  return "#3c3422";
};
</script>

<template>
  <div>
    <div class="TimeBar-Header">
      <div
        class="TimeBar-Year"
        v-for="count of years"
        :key="count"
        :style="{ left: `${(100 * count) / diff}%` }"
      >
        {{ start + count }}
      </div>
      <div
        class="TimeBar-YearLine"
        v-for="count of years"
        :key="count"
        :style="{
          left: `${(100 * count) / diff}%`,
          height: `${releases.length * LINE_HEIGHT}px`,
        }"
      />
      <div
        class="TimeBar-CurrentQuarter"
        :style="{
          left: `${getReleaseLeft({ start: currentYearAndQuarter })}%`,
          width: `calc(${quarterWidth}% - 1px)`,
          height: `calc(${releases.length * LINE_HEIGHT}px - 30px)`,
        }"
      />
      <div
        class="TimeBar-CurrentQuarterTitle"
        :style="{
          left: `${getReleaseLeft({ start: currentYearAndQuarter })}%`,
          top: `calc(${releases.length * LINE_HEIGHT}px - 25px)`,
          width: `calc(${quarterWidth}% - 1px)`,
        }"
      >
        Q{{ currentQuarter }}
      </div>
    </div>
    <div
      class="TimeBar-Release"
      v-for="(release, index) of releases"
      :key="index"
    >
      <div class="TimeBar-ReleaseTitle">{{ release.title }}</div>
      <div
        class="TimeBar-PeriodTitle"
        v-for="period of release.periods"
        :key="release.title + period.title"
        :style="{
          background: getBGColor(period),
          left: `${getReleaseLeft(period)}%`,
          width: `${getReleaseWidth(period)}%`,
        }"
        v-tooltip="period.title"
      >
        {{ period.title }}
      </div>
    </div>
  </div>
</template>

<style>
.TimeBar-Header {
  background-color: #333;
  color: #999;
  font-size: 14px;
  font-weight: 600;
  height: 30px;
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 4px;
}

.TimeBar-Year {
  position: absolute;
  margin-left: -18px;
  z-index: 999;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.TimeBar-YearLine {
  position: absolute;
  border-left: 3px dashed #333;
  top: 0px;
  margin-left: -2px;
}

.TimeBar-Release {
  font-size: 14px;
  font-weight: 600;
  height: 30px;
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 10px;
}

.TimeBar-ReleaseTitle {
  position: absolute;
  left: -60px;
  text-align: right;
  color: rgba(255, 255, 255, 0.8);
}

.TimeBar-PeriodTitle {
  position: absolute;
  color: rgba(255, 255, 245, 0.86);
  height: 100%;
  padding: 0px 10px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}

.TimeBar-PeriodTitle:nth-child(2) {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.TimeBar-PeriodTitle:last-child {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.TimeBar-CurrentQuarter {
  position: absolute;
  background: repeating-linear-gradient(
    45deg,
    #7ceb7c,
    #7ceb7c 10px,
    #58d658 10px,
    #58d658 20px
  );
  top: 0px;
  opacity: 0.4;
  margin-left: 1px;
  margin-top: 30px;
}

.TimeBar-CurrentQuarterTitle {
  position: absolute;
  margin-left: 1px;
  margin-top: 32px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
}
</style>
