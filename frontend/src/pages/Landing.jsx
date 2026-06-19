function Landing(){
    return(
        <div className="min-h-screen bg-white text-gray-900">
            <header className="border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <span className="text-lg font-semibold">HUDForge</span>
                    <nav className="flex items-center gap-2 text-sm">
                        <a href="/login" className="px-4 py-2 text-gray-600 rounded hover:text-gray-900">Entrar</a>
                        <a href="/register" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Crear cuenta</a>
                    </nav>
                </div>
            </header>

            <main>
                <section className="max-w-5xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-4xl font-semibold leading-tight mb-5">
                            Vigila tu ordenador sin complicarte
                        </h1>
                        <p className="text-lg text-gray-600 mb-4">
                            Instalas un pequeño agente y HUDForge te muestra en todo momento
                            cómo van la CPU, la memoria y el disco.
                        </p>
                        <p className="text-gray-600 mb-8">
                            Si algo se sale de lo normal, te avisa por Telegram. Y siempre
                            puedes mirar el historial cuando quieras.
                        </p>
                        <div className="flex gap-3">
                            <a href="/register" className="px-6 py-2.5 bg-green-600 text-white rounded hover:bg-green-700">
                                Empezar gratis
                            </a>
                            <a href="/login" className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                                Ya tengo cuenta
                            </a>
                        </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-medium">Mi servidor</span>
                            <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                En línea
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="text-sm text-gray-500 mb-2">CPU</div>
                                <div className="text-2xl font-semibold text-green-600 mb-2">66%</div>
                                <div className="h-1.5 w-full bg-gray-100 rounded">
                                    <div className="h-1.5 w-2/3 bg-green-600 rounded"></div>
                                </div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="text-sm text-gray-500 mb-2">Memoria</div>
                                <div className="text-2xl font-semibold text-green-600 mb-2">42%</div>
                                <div className="h-1.5 w-full bg-gray-100 rounded">
                                    <div className="h-1.5 w-5/12 bg-green-600 rounded"></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="text-sm text-gray-500 mb-3">Disco</div>
                            <div className="flex justify-between text-sm mb-1.5">
                                <span className="text-gray-700">C:\</span>
                                <span className="text-amber-600">78%</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded">
                                <div className="h-1.5 w-3/4 bg-amber-500 rounded"></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-gray-50 border-y border-gray-100">
                    <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10">
                        <div>
                            <h2 className="font-medium mb-2">En tiempo real</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                CPU, memoria, disco y procesos actualizados al momento, con gráficas
                                fáciles de leer.
                            </p>
                        </div>
                        <div>
                            <h2 className="font-medium mb-2">Avisos por Telegram</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Decides tus límites y recibes un mensaje en cuanto algo se pasa de la raya.
                            </p>
                        </div>
                        <div>
                            <h2 className="font-medium mb-2">Sin líos</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Creas tu cuenta, instalas el agente con tu token y listo. En un par de minutos.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="max-w-5xl mx-auto px-6 py-20 text-center">
                    <h2 className="text-2xl font-semibold mb-6">¿Lo probamos?</h2>
                    <a href="/register" className="inline-block px-6 py-2.5 bg-green-600 text-white rounded hover:bg-green-700">
                        Crear cuenta
                    </a>
                </section>
            </main>

            <footer className="border-t border-gray-100">
                <div className="max-w-5xl mx-auto px-6 py-6 text-sm text-gray-400">
                    HUDForge
                </div>
            </footer>
        </div>
    )
}
export default Landing;
