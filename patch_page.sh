sed -i '' -e '/export default function LandingPage() {/i\
\
const heroImages = [\
  "/images/hero-laptop.png",\
  "/images/hero-phone.png",\
  "/images/hero-call.jpg"\
];\
\
function HeroBackgroundFader() {\
  const [currentIndex, setCurrentIndex] = useState(0);\
  useEffect(() => {\
    const timer = setInterval(() => {\
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);\
    }, 5000);\
    return () => clearInterval(timer);\
  }, []);\
  return (\
    <div className="absolute inset-0 z-0 overflow-hidden bg-zinc-950">\
      <AnimatePresence mode="popLayout">\
        <motion.img\
          key={currentIndex}\
          src={heroImages[currentIndex]}\
          initial={{ opacity: 0, scale: 1.05 }}\
          animate={{ opacity: 0.4, scale: 1 }}\
          exit={{ opacity: 0 }}\
          transition={{ duration: 1.5, ease: "easeInOut" }}\
          className="absolute inset-0 w-full h-full object-cover object-center"\
          alt="Hero background"\
        />\
      </AnimatePresence>\
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/80 to-[#FAF9F5]" />\
    </div>\
  );\
}\
' /Users/murewaajala/Downloads/CyberEscape_Complete_Package/cybersecurity-escape-room/client/src/app/page.tsx
