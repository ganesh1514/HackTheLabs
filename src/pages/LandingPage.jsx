import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqData } from "@/constants/faq"; // Assuming you have a data file for FAQs
const LandingPage = () => {
  return (
    <>
      <div
        id="landing-page"
        className="h-[600px]  flex flex-col justify-center items-start sm:items-center mt-8 sm:mt-16 lg:mt-20"
      >
        <h2 className="mt-10 mb-3 sm:my-14 text-4xl sm:text-6xl lg:text-7xl text-white sm:text-center tracking-tight font-semibold text-pretty px-0 sm:px-8 md:px-12 lg:px-16 sm:leading-18">
          The only <span className="text-primary-orange">URL Shortener</span>{" "}
          you&rsquo;ll ever need!
        </h2>
        <p
          className="text-lg sm:text-xl
      text-gray-300 sm:text-center text-pretty max-w-2xl"
        >
          Make your links shine✨ with our powerful URL shortener.
        </p>
        <p
          className="text-sm sm:text-lg
      text-gray-500 sm:text-center text-pretty max-w-2xl "
        >
          Yes!! You can use it for your practical lab exams too🤫
        </p>
        <form className="flex flex-col sm:flex-row items-start sm:items-center gap-4 my-6 sm:my-10 w-full sm:w-2/3 lg:w-1/2">
          <div className="relative flex-1 sm:flex-2 w-full group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-orange-shade via-primary-orange to-primary-orange-tint rounded-lg opacity-60 group-focus-within:opacity-0  transition-all duration-200 ease-out"></div>
            <Input
              className={
                "relative flex-1 h-full p-4 bg-black focus-outline-none"
              }
              // onChange={}
              type="url"
              placeholder={"Paste your URL here"}
            />
          </div>
          <Button
            className="w-full  flex-0 sm:w-auto cursor-pointer h-full px-4 py-4"
            type="submit"
          >
            Shorten it!
          </Button>
        </form>
      </div>
      <div>
        <Accordion
          type="single"
          collapsible
          className="w-full sm:w-2/3 lg:w-1/2 mt-8 rounded-lg shadow-lg sm:mx-auto"
          defaultValue="item-1"
        >
          {faqData.map((faq, index) => (
            <AccordionItem
              value={`item-${faq.item}`}
              key={index}
              className={"group"}
            >
              <AccordionTrigger
                className={
                  "group-hover:text-primary-orange  text-lg sm:text-xl"
                }
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-balance text-sm">
                <p>{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
};

export default LandingPage;
