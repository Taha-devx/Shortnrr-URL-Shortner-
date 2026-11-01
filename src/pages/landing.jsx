import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import React from "react";

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl) {
      navigate(`/auth?createNew=${longUrl}`);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-white text-center font-extrabold">
        The only URL Shortner service you'll ever need 👇
      </h2>
      <form
        onSubmit={handleShorten}
        className="sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-4"
      >
        <Input
          type="url"
          value={longUrl}
          placeholder="Paste your URL here..."
          className="h-full flex-1 py-4 px-4 rounded-lg text-white"
          onChange={(e) => setLongUrl(e.target.value)}
        />
        <Button
          className="h-full py-4 px-4 rounded-lg"
          variant="destructive"
          type="submit"
        >
          Shortnrr!
        </Button>
      </form>
      <img src="/banner.png" alt="banner" className="w-full my-11 md:px-11" />

      <Accordion type="multiple" className="w-full md:px-11">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            How does the Shortnrr URL shortening work?
          </AccordionTrigger>
          <AccordionContent>
            When you enter a long URL, our system generates a shorter version of
            that URL. This shortened URL redirects to the original long URL when
            accessed.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            Do I need an account to use Shortnrr?
          </AccordionTrigger>
          <AccordionContent>
            Yes, Creating an account allows you to manage your shortened URLs,
            track their performance, and customize your short URLs.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            What analytics are available for my shortened URLs?
          </AccordionTrigger>
          <AccordionContent>
            You can view the number of clicks, geographic location of visitors,
            and referral sources for each of your shortened URLs. This data
            helps you understand your audience and the effectiveness of your
            links.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LandingPage;
