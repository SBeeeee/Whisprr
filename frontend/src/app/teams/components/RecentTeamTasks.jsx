"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/components/Card";
import FilterBar from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
import TasksTable from "./TasksTable";
import Loader from "@/components/Loader";
import { useParams } from "next/navigation";
import {
  setTeamTasks,
  setTeamTasksLoading,
  setTeamTasksFilters,
  setTeamTasksPage
} from "@/store/teams/slice";

import { getteamtasks } from "../api/teams.api";

export default function RecentTeamTasks() {
  const dispatch = useDispatch();
  const { teamId } = useParams();
  const {
    teamTasks,
    teamTasksLoading,
    teamTasksFilters,
    teamTasksPagination
  } = useSelector((state) => state.teams);

  const fetchTasks = async () => {
    dispatch(setTeamTasksLoading(true));

    const res = await getteamtasks(teamId, {
      ...teamTasksFilters,
      page: teamTasksPagination.page,
      limit: teamTasksPagination.limit
    });

    if (res.success) {
      dispatch(
        setTeamTasks({
          tasks: res.data.tasks,
          pagination: res.data.pagination
        })
      );
    }

    dispatch(setTeamTasksLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, [teamTasksFilters, teamTasksPagination.page]);

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Recent Team Tasks</h3>
      </div>

      <FilterBar
        filters={teamTasksFilters}
        setFilters={(f) => dispatch(setTeamTasksFilters(f))}
      />

      {teamTasksLoading ? (
        <Loader text="Loading team tasks..." />
      ) : (
        <>
          <TasksTable tasks={teamTasks} />
          <Pagination
            page={teamTasksPagination.page}
            totalPages={teamTasksPagination.totalPages}
            onPageChange={(p) => dispatch(setTeamTasksPage(p))}
          />
        </>
      )}
    </Card>
  );
}
