"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/hooks/use-confirm";
import { fileToBase64 } from "@/lib/fileToBase64";
import { cn } from "@/lib/utils";
import { TWorkspace } from "@/types/workspace";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDeleteProject } from "../hooks/useDeleteProject";
import { useUpdateProject } from "../hooks/useUpdateProject";

type TEditProjectForm = {
  onCancel?: () => void;
  initialValues: TWorkspace;
};

const updateWorkspaceSchema = z.object({
  name: z.string().min(1, "Must be 1 or more characters"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

export const EditProjectForm = ({
  onCancel,
  initialValues,
}: TEditProjectForm) => {
  const params = useParams();
  const { mutate: update, isPending } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeletePending } =
    useDeleteProject();

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete project",
    "Are you sure you want to delete this project?",
    "destructive"
  );

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.image || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof updateWorkspaceSchema>) => {
    let imageBase64 = "";

    if (values.image instanceof File) {
      imageBase64 = await fileToBase64(values.image);
    }

    const preparedData = {
      project: {
        ...values,
        image: imageBase64,
      },
    };

    update(
      {
        workspaceId: params.workspaceId as string,
        projectId: initialValues.id,
        data: preparedData,
      },
      {
        onSuccess: () => {
          form.reset({
            ...values,
            image: imageBase64 || "",
          });
        },
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      form.setValue("image", file);
    }
  };

  const onBackClick = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push(`/workspaces/${initialValues.id}`);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirmDelete();

    if (confirmed) {
      deleteProject({
        workspaceId: params.workspaceId as string,
        id: initialValues.id,
      });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-y-4">
        <Card className="w-full h-full border-none shadow-none">
          <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
            <Button variant="secondary" size="sm" onClick={onBackClick}>
              <ArrowLeftIcon className="size-4 mr-2" />
              Back
            </Button>
            <CardTitle className="text-xl font-bold">
              {initialValues.name}
            </CardTitle>
          </CardHeader>
          <div className="px-7">
            <DottedSeparator />
          </div>
          <CardContent className="p-7">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-y-4">
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter workspace name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="image"
                    control={form.control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-y-2">
                        <div className="flex items-center gap-x-5">
                          {field.value ? (
                            <div className="size-[72px] relative rounded-md overflow-hidden">
                              <Image
                                fill
                                className="object-cover"
                                alt="Logo"
                                src={
                                  field.value instanceof File
                                    ? URL.createObjectURL(field.value)
                                    : field.value
                                }
                              />
                            </div>
                          ) : (
                            <Avatar className="size-[72px]">
                              <AvatarFallback>
                                <ImageIcon className="size-[36px] text-neutral-400" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className="flex flex-col">
                            <p className="text-sm">Project icon</p>
                            <p className="text-sm text-muted-foreground">
                              JPG, PNG, SVG or JPEG
                            </p>
                            <input
                              type="file"
                              className="hidden"
                              ref={inputRef}
                              accept=".png, .jpg, .svg, .jpeg"
                              disabled={isPending}
                              onChange={handleImageChange}
                            />
                            {field.value ? (
                              <Button
                                variant="destructive"
                                disabled={isPending}
                                size="xs"
                                type="button"
                                className="w-fit mt-2"
                                onClick={() => {
                                  field.onChange("");
                                  if (inputRef.current) {
                                    inputRef.current.value = "";
                                  }
                                }}
                              >
                                Remove image
                              </Button>
                            ) : (
                              <Button
                                variant="teritary"
                                disabled={isPending}
                                size="xs"
                                type="button"
                                className="w-fit mt-2"
                                onClick={() => inputRef.current?.click()}
                              >
                                Upload image
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>
                <DottedSeparator className="py-7" />
                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    onClick={onCancel}
                    size="lg"
                    variant="secondary"
                    className={cn(!onCancel && "invisible")}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isPending}
                    type="submit"
                    size="lg"
                    variant="primary"
                  >
                    Save changes
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="w-full h-full border-none shadow-none">
          <CardContent className="p-7">
            <div className="flex flex-col">
              <h3 className="text-lg font-bold">Danger zone</h3>
              <p className="text-sm text-muted-foreground">
                Deleting a project is irreversible and will remove all
                associated data.
              </p>
              <DottedSeparator className="py-7" />
              <Button
                className="w-fit ml-auto"
                size="sm"
                variant="destructive"
                type="button"
                disabled={isPending || isDeletePending}
                onClick={handleDelete}
              >
                Delete project
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <DeleteDialog />
    </>
  );
};
