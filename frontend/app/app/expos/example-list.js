import React from "react";
import HelloWorld1 from "./examples/1-hello-world/1.HelloWorld1";
import HelloWorld2 from "./examples/1-hello-world/2.HelloWorld2";
import MomoLogin from "./examples/2-login-screen/1.MomoLogin";
import FacebookLogin from "./examples/2-login-screen/2.FacebookLogin";
import TheLight from "./examples/3-the-light/1.TheLight";
import TrafficLight from "./examples/3-the-light/2.TrafficLight";
import RegisterForm from "./examples/4-register-form/RegisterForm";
import InstagramFeed from "./examples/5-instagram-feed/InstagramFeed";
import RockPaperScissors from "./examples/6-rock-paper-scissors/RockPaperScissors";
import ScanQrCode from "./examples/7-scan-qr-code/ScanQrCode";
import StopWatch from "./examples/8-stopwatch/StopWatch";
import BMICalculator from "./examples/9-bmi-calculator/BMICalculator";
import MusicPlayer from "./examples/10-music-player/MusicPlayer";
import WorldwideNews from "./examples/11-news/WorldwideNews";
import Pokedex from "./examples/12-pokedex/Pokedex";
import AgendaScreen from "./examples/13-calender/calender";
import Apitest from "./examples/apitest/index";
import Apitesta from "./examples/apitest/index";
import Apitestb from "./examples/apitest/index";
import Apitestc from "./examples/apitest/index";
import ModalTestScreen from "./examples/modal/index";
import MyComponent from "./examples/chip/chip";
import Appl from "./examples/with-apollo/Appl";
import Chat from "./p0005/App";
import Axios from "./axios/App";
//import Story from "./storybook/App";

//
export const EXAMPLE_LIST = [
      {
    name: "p0005 Chat",
    level: 18,
    component: <Chat />,
  },
       {
    name: "Storybook",
    level: 18,
    component: <getStorybookUI />,
  },
    {
    name: "axois Axos",
    level: 18,
    component: <Axios />,
  },
    {
    name: "chip",
    level: 18,
    component: <Appl />,
  },
  {
    name: "chip",
    level: 18,
    component: <chip />,
  },
     {
    name: "Modaltest",
    level: 17,
    component: <ModalTestScreen />,
  },
     {
    name: "Apitest",
    level: 16,
    component: <Apitest />,
  },
    {
    name: "Pokedex",
    level: 12,
    component: <Pokedex />,
  },
   {
    name: "Calender",
    level: 1,
    component: <AgendaScreen />,
  },
  {
    name: "Hello World 1",
    level: 1,
    component: <HelloWorld1 />,
  },
  {
    name: "Hello World 2",
    level: 1,
    component: <HelloWorld2 />,
  },
  {
    name: "Momo Login Screen",
    level: 2,
    component: <MomoLogin />,
  },
  {
    name: "Facebook Login Screen",
    level: 2,
    component: <FacebookLogin />,
  },
  {
    name: "The Light",
    level: 3,
    component: <TheLight />,
  },
  {
    name: "Traffic Light",
    level: 3,
    component: <TrafficLight />,
  },
  {
    name: "Register Form",
    level: 4,
    component: <RegisterForm />,
  },
  {
    name: "Instagram Feed",
    level: 5,
    component: <InstagramFeed />,
  },
  {
    name: "Rock Paper Scissors",
    level: 6,
    component: <RockPaperScissors />,
  },
  {
    name: "Scan QR Code",
    level: 7,
    component: <ScanQrCode />,
  },
  {
    name: "Stop Watch",
    level: 8,
    component: <StopWatch />,
  },
  {
    name: "BMI Calculator",
    level: 9,
    component: <BMICalculator />,
  },
  {
    name: "Music Player",
    level: 10,
    component: <MusicPlayer />,
  },
  {
    name: "Worldwide News",
    level: 11,
    component: <WorldwideNews />,
  },
];
