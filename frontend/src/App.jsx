import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Stack,
  Heading,
  Text,
  Button,
  Select,
  Textarea,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { HiSpeakerWave } from "react-icons/hi2";
import { FaStopCircle } from "react-icons/fa";
import LanguagesSelect from "./components/LanguagesSelect";

const App = () => {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");
  const [isLoading, setIsLoading] = useState(false);
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setSourceText(transcript);
    }
  }, [transcript]);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

  const handleTranslate = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${apiBaseUrl}/translate-text`,
        {
          text: sourceText,
          sourceLang,
          targetLang,
        }
      );
      setTranslatedText(response.data.translatedText);
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeechToText = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      resetTranscript();
    } else {
      SpeechRecognition.startListening();
    }
  };

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = targetLang;
      speechSynthesis.speak(utterance);
    } else {
      console.error('Speech synthesis not supported');
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-b, #0B1120, #111827)"
      color="white"
      py={10}
    >
      <Box maxW="container.md" mx="auto" px={{ base: 4, md: 6 }}>
        <Stack spacing={4} textAlign="center" mb={8}>
          <Heading size="2xl">GlobalLingo Translator</Heading>
          <Text fontSize="lg" color="gray.300">
            Translate text instantly, listen to translations, and switch languages with a modern glass-style UI.
          </Text>
        </Stack>

        <Box
          bg="rgba(255,255,255,0.06)"
          border="1px solid rgba(255,255,255,0.14)"
          backdropFilter="blur(20px)"
          borderRadius="3xl"
          boxShadow="0 24px 80px rgba(15,23,42,0.35)"
          p={{ base: 6, md: 8 }}
        >
          <VStack spacing={5} w="100%">
            <Textarea
              placeholder="Enter text to translate"
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              size="sm"
              resize="vertical"
              bg="whiteAlpha.100"
              color="white"
              borderColor="rgba(148,163,184,0.24)"
              _placeholder={{ color: "gray.400" }}
            />

            <HStack spacing={5} w="100%" flexWrap="wrap">
              <Select
                placeholder="Source language"
                onChange={(e) => setSourceLang(e.target.value)}
                key="source-lang"
                value={sourceLang}
                flexBasis={{ base: "100%", md: "48%" }}
                bg="#1655b8"
                color="white"
                iconColor="white"
                borderColor="rgba(255, 255, 255, 0.18)"
                focusBorderColor="#38bdf8"
                borderRadius="xl"
                _placeholder={{ color: "whiteAlpha.600" }}
                _hover={{ bg: "#1e66c2" }}
                _focus={{ bg: "#1655b8" }}
              >
                <LanguagesSelect />
              </Select>
              <Select
                placeholder="Target language"
                onChange={(e) => setTargetLang(e.target.value)}
                key="target-lang"
                value={targetLang}
                flexBasis={{ base: "100%", md: "48%" }}
                bg="#1655b8"
                color="white"
                iconColor="white"
                borderColor="rgba(255, 255, 255, 0.18)"
                focusBorderColor="#38bdf8"
                borderRadius="xl"
                _placeholder={{ color: "whiteAlpha.600" }}
                _hover={{ bg: "#1e66c2" }}
                _focus={{ bg: "#1655b8" }}
              >
                <LanguagesSelect />
              </Select>
            </HStack>

            <HStack spacing={4} w="100%" flexWrap="wrap">
              <Button
                onClick={handleTranslate}
                w={{ base: "100%", md: "auto" }}
                colorScheme="cyan"
                flexGrow={{ base: 1, md: 0 }}
                minW={{ md: "48%" }}
                borderRadius="full"
                boxShadow="lg"
              >
                {isLoading ? (
                  <HStack spacing={2}>
                    <Spinner size="sm" />
                    <span>Translating...</span>
                  </HStack>
                ) : (
                  "Translate"
                )}
              </Button>

              <Button
                onClick={handleTextToSpeech}
                w={{ base: "100%", md: "auto" }}
                colorScheme="cyan"
                variant="outline"
                flexGrow={{ base: 1, md: 0 }}
                minW={{ md: "48%" }}
                borderRadius="full"
                boxShadow="lg"
              >
                Play Translated Text
              </Button>
            </HStack>

            <Box
              w="100%"
              p={5}
              bg="rgba(255,255,255,0.05)"
              borderRadius="2xl"
              border="1px solid rgba(255,255,255,0.10)"
            >
              <Text fontWeight="semibold" mb={3} color="gray.200">
                Translated Text
              </Text>
              <Textarea
                value={translatedText}
                readOnly
                size="sm"
                resize="vertical"
                bg="transparent"
                borderColor="rgba(148,163,184,0.24)"
                color="white"
                minH="160px"
              />
            </Box>

            <Button
              aria-label="Toggle listening"
              onClick={handleSpeechToText}
              rightIcon={listening ? <FaStopCircle /> : <HiSpeakerWave />}
              colorScheme="cyan"
              variant="ghost"
              w={{ base: "100%", md: "48%" }}
              borderRadius="full"
            >
              {listening ? "Stop Listening" : "Start Listening"}
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
