import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      {/* 英雄区域 */}
      <div className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 bg-white pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
            <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">日语学习从未如此</span>{' '}
                  <span className="block text-primary-600 xl:inline">简单高效</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                  EchoKana 是一个全面的日语学习平台，提供听写练习、阅读训练和智能词汇复习系统，帮助您掌握日语的听、说、读、写能力。
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {!isAuthenticated ? (
                    <>
                      <div className="rounded-md shadow">
                        <Link
                          to="/register"
                          className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary-600 px-8 py-3 text-base font-medium text-white hover:bg-primary-700 md:py-4 md:px-10 md:text-lg"
                        >
                          立即注册
                        </Link>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <Link
                          to="/login"
                          className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary-100 px-8 py-3 text-base font-medium text-primary-700 hover:bg-primary-200 md:py-4 md:px-10 md:text-lg"
                        >
                          登录账号
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-md shadow">
                        <Link
                          to="/dictation"
                          className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary-600 px-8 py-3 text-base font-medium text-white hover:bg-primary-700 md:py-4 md:px-10 md:text-lg"
                        >
                          开始听写练习
                        </Link>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <Link
                          to="/reading"
                          className="flex w-full items-center justify-center rounded-md border border-transparent bg-secondary-600 px-8 py-3 text-base font-medium text-white hover:bg-secondary-700 md:py-4 md:px-10 md:text-lg"
                        >
                          浏览阅读文章
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-r from-primary-400 to-secondary-500 sm:h-72 md:h-96 lg:h-full lg:w-full"></div>
        </div>
      </div>

      {/* 功能特点 */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">功能特点</h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              更智能的日语学习方式
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              EchoKana 结合了现代教育科学和技术，为您提供个性化的日语学习体验。
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="card">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">听写练习</h3>
              <p className="text-gray-600 mb-4">
                从基础的平假名、片假名到复杂的日常对话，我们提供不同难度级别的听写内容，帮助您循序渐进地提高听力和书写能力。
              </p>
              <Link to="/dictation" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                查看听写练习
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <div className="card">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">阅读练习</h3>
              <p className="text-gray-600 mb-4">
                浏览我们精心挑选的阅读文章，从初级到高级应有尽有。每篇文章都配有生词表和理解问题，帮助您更好地理解和记忆内容。
              </p>
              <Link to="/reading" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                查看阅读练习
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <div className="card">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">SRS复习系统</h3>
              <p className="text-gray-600 mb-4">
                使用科学的间隔重复系统(SRS)，高效地记忆和复习日语词汇。系统会根据您的记忆曲线自动安排最佳的复习时间，确保长期记忆。
              </p>
              <Link to="/srs" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                开始复习
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 开始学习号召 */}
      <div className="bg-primary-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <span className="block">准备好提升您的日语水平了吗？</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            开始使用 EchoKana，让日语学习变得更加高效和有趣。
          </p>
          {!isAuthenticated ? (
            <Link
              to="/register"
              className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-primary-600 hover:bg-primary-50 sm:w-auto"
            >
              立即免费注册
            </Link>
          ) : (
            <Link
              to="/dictation"
              className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-primary-600 hover:bg-primary-50 sm:w-auto"
            >
              立即开始学习
            </Link>
          )}
        </div>
      </div>
    </>
  );
} 