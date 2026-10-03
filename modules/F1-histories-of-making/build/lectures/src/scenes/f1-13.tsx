import {makeScene2D} from '@motion-canvas/2d';
import {buildHouse, runLecture} from '../house/Station';
import type {LectureData} from '../house/lecture';
import lecture from '../lectures/f1-13.json';

/** F1.13 Networks: the whole lecture is data; this scene only binds it to the house. */
export default makeScene2D(function* (view) {
  const data = lecture as unknown as LectureData;
  const house = buildHouse(view, data);
  yield* runLecture(house, data);
});
