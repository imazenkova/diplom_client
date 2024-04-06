import {
  ApiResource,
  IItemResource,
  IItemTypeResource,
  ILoadResource,
  IResource,
  IResultResource
} from "../shared.lib/api/resource.api";


import axios from 'axios';
import { getAxiosSettings } from "./config.axios";

export const ResourceApi = {

  save: async (resourcePayload: IResource): Promise<IResultResource> => {
    const res = await axios.post<IResultResource>(ApiResource.save.path, { ...resourcePayload }, getAxiosSettings())
    return res.data
  },

  saveMany: async (resourcePayload: IResource[]): Promise<IResultResource[]> => {
    const res = await axios.post<IResultResource[]>(ApiResource.saveMany.path, resourcePayload, getAxiosSettings())
    return res.data
  },

  loadList: async (itemType: IItemTypeResource): Promise<IResource[]> => {
    const res = await axios.post(ApiResource.loadList.path, itemType, getAxiosSettings())
    return res.data
  },

  loadMany: async (resourcePayload: IItemResource[]): Promise<ILoadResource[]> => {
    const res = await axios.post<ILoadResource[]>(ApiResource.loadMany.path, resourcePayload, getAxiosSettings())
    return res.data
  },

  delete: async (resourcePayload: IItemResource[]): Promise<void> => {
    const res = await axios.post(ApiResource.delete.path, resourcePayload, getAxiosSettings())
    return res.data
  },

  loadResList: async (): Promise<IResource> => {
    const res = await axios.get(ApiResource.loadList.path, getAxiosSettings())
    return res.data
  },

  load: async (resourcePayload: IItemResource): Promise<ILoadResource>=> {
      const res = await axios.post(ApiResource.load.path, resourcePayload, getAxiosSettings());
      return res.data;
  },
};
