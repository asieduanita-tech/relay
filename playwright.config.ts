import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:'*.spec.ts',timeout:90000,fullyParallel:false,workers:1,use:{baseURL:process.env.PLAYWRIGHT_BASE_URL||'http://127.0.0.1:3000',headless:true,channel:'chrome',trace:'retain-on-failure'},reporter:'list'});
