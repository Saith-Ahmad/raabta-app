"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast"
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThreadValidation } from "@/lib/validations/threads";
import { createThread } from "@/lib/actions/thread.action";
import { ChangeEvent, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";
import { Input } from "../ui/input";
import Image from "next/image";
import { CrossIcon, ImageIcon, X } from "lucide-react";
interface Props {
  userId: string;
}

function PostThread({ userId }: Props) {
  const { startUpload } = useUploadThing("media");
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { organization } = useOrganization();

  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    setIsLoading(true);
    try {
      let threadImageUrl = undefined;
  
      // Check if there is a thread image to process
      if (values.threadImage) {
        const hasImageChanged = isBase64Image(values.threadImage);
        if (hasImageChanged) {
          const imgRes = await startUpload(files);
  
          // Verify if the upload succeeded and URL starts with the desired prefix
          if (imgRes && imgRes[0]?.fileUrl.startsWith("https://uploadthing.com")) {
            threadImageUrl = imgRes[0].fileUrl;
          } 
      }}
  
      // Proceed to create the thread
      await createThread({
        text: values.thread,
        author: userId,
        communityId: organization ? organization.id : null,
        path: pathname,
        threadImage: threadImageUrl, // Only valid image URLs are sent
      });
  
      router.push("/");
      toast({
        title: "Thread Added Successfully",
        variant: "dark",
      });
    } catch (error) {
      toast({
        title: "Failed to Create Thread",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  



  const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
    e.preventDefault();
    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));
      if (!file.type.includes('image')) return;
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      }
      fileReader.readAsDataURL(file);

    }
  };

  return (
    <Form {...form}>
      <form
        className="mt-10 flex flex-col justify-start gap-10 bg-opacity-50 backdrop-blur-lg"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-1">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={12} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="threadImage"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-1">
              <FormLabel className="text-base-semibold text-light-2">
                <p className="mb-2">Add Image</p>
                <div className="relative border border-dark-4 bg-dark-3 min-h-[120px] w-[120px] flex justify-center items-center rounded-lg">
                  {field.value ? (
                    <>
                      <Image
                        src={field.value}
                        alt="Uploaded Image"
                        width={120}
                        height={120}
                        priority
                        unoptimized
                        quality={100}
                        className="object-contain rounded-lg"
                      />
                      {/* Cross Icon */}
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange("");
                          setFiles([]);
                        }}
                        className="absolute -top-1 z-10 -right-1 bg-white text-black rounded-full w-6 h-6 flex justify-center items-center"
                      >
                        <X />
                      </button>
                    </>
                  ) : 
                  <ImageIcon strokeWidth={0.2} size={120}/>
                  }
                </div>
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Attach Picture"
                  className="thread-form_image-input text-gray-400 font-light"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <Button type="submit" className="sidebar_left_class_active" disabled={isLoading}>
          {!isLoading ? "Post Thread" : "Posting..."}
        </Button>
      </form>
    </Form>
  );
}

export default PostThread;
