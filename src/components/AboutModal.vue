<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      @click="$emit('close')"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <Transition
        enter-active-class="transition-all duration-300 ease-out delay-100"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div
          v-if="show"
          @click.stop
          class="bg-background w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-themed rounded-2xl shadow-lg border border-border"
        >
          <!-- Conteúdo do modal -->
          <div class="p-6 md:p-8">
            <div class="flex justify-between items-start mb-6">
              <div class="flex items-center gap-4">
                <div>
                  <h2 class="font-display text-2xl font-bold text-primary">
                    Sobre o Projeto
                  </h2>
                  <p class="text-muted-foreground">Festivais da Amazônia</p>
                </div>
              </div>
              <button
                @click="$emit('close')"
                class="text-muted-foreground hover:text-accent p-2 hover:bg-accent/10 rounded-lg transition-colors"
              >
                <X :size="24" />
              </button>
            </div>

            <div
              class="prose prose-sm md:prose-base max-w-none text-foreground/90 prose-strong:text-primary prose-a:text-accent prose-a:underline-offset-4"
            >
              <div
                class="bg-primary/5 p-4 rounded-xl border-l-4 border-primary"
              >
                <p>
                  O <strong>Festivais da Amazônia</strong> é um projeto de
                  código aberto que celebra a diversidade cultural da maior
                  floresta tropical do planeta. Através deste mapa interativo,
                  buscamos preservar e difundir as tradições folclóricas,
                  rituais indígenas e manifestações artísticas únicas desta
                  região.
                </p>
              </div>

              <h3 class="mt-6 flex items-center gap-2 text-foreground">
                <MapPin :size="18" class="text-accent" />
                Nossa Missão
              </h3>
              <p>
                Conectar pessoas às raízes culturais amazônicas, promovendo:
              </p>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div class="bg-muted/50 p-4 rounded-xl">
                  <h4
                    class="font-bold text-primary mb-2 flex items-center gap-2"
                  >
                    Valores Culturais
                  </h4>
                  <div class="space-y-2 text-sm">
                    <div class="flex items-start gap-2">
                      <span class="text-accent mt-0.5">→</span>
                      <span>Preservação do folclore e tradições caboclas</span>
                    </div>
                    <div class="flex items-start gap-2">
                      <span class="text-accent mt-0.5">→</span>
                      <span
                        >Valorização dos povos originários e saberes
                        indígenas</span
                      >
                    </div>
                    <div class="flex items-start gap-2">
                      <span class="text-accent mt-0.5">→</span>
                      <span>Resgate de manifestações culturais em risco</span>
                    </div>
                  </div>
                </div>

                <div class="bg-muted/50 p-4 p-b-1 rounded-xl">
                  <h4
                    class="font-bold text-primary mb-2 flex items-center gap-2"
                  >
                    Sustentabilidade
                  </h4>
                  <div class="space-y-2 text-sm">
                    <div class="flex items-start gap-2">
                      <span class="text-accent mt-0.5">→</span>
                      <span>Fomento ao turismo consciente</span>
                    </div>
                    <div class="flex items-start gap-2">
                      <span class="text-accent mt-0.5">→</span>
                      <span>Conexão entre visitantes e comunidades</span>
                    </div>
                    <div class="flex items-start gap-2">
                      <span class="text-accent mt-0.5">→</span>
                      <span>Educação ambiental através da cultura</span>
                    </div>
                  </div>
                </div>
              </div>

              <h3 class="mt-6 flex items-center gap-2 text-foreground">
                <Users :size="18" class="text-accent" />
                Para Quem É Este Projeto?
              </h3>
              <div class="bg-muted/50 p-4 rounded-xl">
                <div class="space-y-2 text-sm">
                  <div class="flex items-start gap-2">
                    <UserCheck
                      :size="16"
                      class="text-accent mt-0.5 flex-shrink-0"
                    />
                    <span>Viajantes em busca de experiências autênticas</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <BookOpen
                      :size="16"
                      class="text-accent mt-0.5 flex-shrink-0"
                    />
                    <span>Pesquisadores e estudantes de cultura popular</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <Mic2 :size="16" class="text-accent mt-0.5 flex-shrink-0" />
                    <span>Artistas e grupos folclóricos</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <Map :size="16" class="text-accent mt-0.5 flex-shrink-0" />
                    <span>Gestores culturais e secretarias de turismo</span>
                  </div>
                </div>
              </div>

              <div
                class="bg-accent/5 p-4 rounded-xl border-l-4 border-accent mt-6"
              >
                <h4 class="font-bold text-primary mb-2 flex items-center gap-2">
                  <GitFork :size="16" class="text-accent" />
                  Como Contribuir
                </h4>
                <p class="mb-3">
                  Este é um projeto colaborativo! Você pode ajudar de várias
                  formas:
                </p>
                <ul class="space-y-2 text-sm">
                  <li class="flex items-start gap-2">
                    <span
                      class="bg-accent/10 text-accent rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0"
                      >1</span
                    >
                    <div>
                      <strong>Sugira novos festivais</strong> através de
                      <a
                        href="https://github.com/fernandoguedes/mapa-festivais/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="font-medium"
                        >issues no GitHub</a
                      >
                    </div>
                  </li>
                  <li class="flex items-start gap-2">
                    <span
                      class="bg-accent/10 text-accent rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0"
                      >2</span
                    >
                    <div>
                      <strong>Corrija informações</strong> enviando
                      <a
                        href="https://github.com/fernandoguedes/mapa-festivais/pulls"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="font-medium"
                        >Pull Requests</a
                      >
                    </div>
                  </li>
                  <li class="flex items-start gap-2">
                    <span
                      class="bg-accent/10 text-accent rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0"
                      >3</span
                    >
                    <div>
                      <strong>Compartilhe conhecimento</strong> sobre tradições,
                      lendas ou rituais específicos
                    </div>
                  </li>
                </ul>
              </div>

              <p
                class="text-center text-muted-foreground border-t border-border pt-4 mt-8 flex flex-col items-center"
              >
                <span class="flex items-center gap-1">
                  Feito com
                  <Star
                    class="text-accent mx-1"
                    :size="16"
                    color="blue"
                    fill="blue"
                  />
                  em prol da diversidade amazônica
                </span>
              </p>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script>
import {
  X,
  Heart,
  GitFork,
  Star,
  MapPin,
  Users,
  UserCheck,
  BookOpen,
  Mic2,
  Map,
  Github,
  Trees,
} from "lucide-vue-next";

export default {
  name: "AboutModal",
  components: {
    X,
    Heart,
    GitFork,
    Star,
    MapPin,
    Users,
    UserCheck,
    BookOpen,
    Mic2,
    Map,
    Github,
    Trees,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close"],
  watch: {
    show(newVal) {
      if (newVal) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    },
  },
  unmounted() {
    document.body.style.overflow = "";
  },
};
</script>
