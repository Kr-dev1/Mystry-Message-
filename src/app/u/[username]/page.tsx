"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import * as z from "zod";
import { Apiresponse } from "@/types/Apiresponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MessageSchema } from "@/Schemas/messageSchema";
import { Skeleton } from "@/components/ui/skeleton";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar).map((item) => item.trim());
};

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const defaultMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";

  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestLoading, setIsSuggestionLodaing] = useState(false);
  const [suggestionError, setSuggestionError] = useState("");
  const [messageString, setMessageString] = useState(defaultMessageString);

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<Apiresponse>("/api/send-message", {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<Apiresponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to sent message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      setIsSuggestionLodaing(true);
      const result = await axios.post("/api/suggest-messages");
      setMessageString(result.data.message);
    } catch (error) {
      setMessageString(defaultMessageString);
      const axiosError = error as AxiosError<Apiresponse>;
      setSuggestionError(
        axiosError.response?.data.message ?? "Error finding suggestions"
      );
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to get suggestions",
        variant: "destructive",
      });
    } finally {
      setIsSuggestionLodaing(false);
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          {isSuggestLoading ? (
            <Button disabled className="my-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              onClick={fetchSuggestedMessages}
              className="my-4"
              type="submit"
            >
              Suggest Messages
            </Button>
          )}
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {suggestionError && (
              <p className="text-red-500">{suggestionError}</p>
            )}
            {parseStringMessages(messageString).map((message, index) => (
              <>
                {isSuggestLoading ? (
                  <div className="flex flex-col space-y-3">
                    <Skeleton className="h-10 w-full mb-2" />
                  </div>
                ) : (
                  <Button
                    key={index}
                    variant="outline"
                    className="mb-2"
                    onClick={() => handleMessageClick(message)}
                  >
                    {message}
                  </Button>
                )}
              </>
            ))}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}
