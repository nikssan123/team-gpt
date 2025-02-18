import { Table } from "@radix-ui/themes";
import { Notification } from "@/app/_context/NotificationContext";
const NotificationTable: React.FC<{ type: string; notifications: Notification[] | null }> = ({
    type,
    notifications,
}) => {
    const renderItems = () => {
        return notifications?.map(item => {
            return (
                <Table.Row className="hover:bg-gray-700" key={item.id}>
                    <Table.Cell className="text-white">{item.message}</Table.Cell>
                    <Table.Cell className="text-gray-300">{item.person}</Table.Cell>
                    <Table.Cell className="text-gray-300">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </Table.Cell>
                </Table.Row>
            );
        });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-800 p-6">
            <div className="w-full max-w-4xl p-6 shadow-lg">
                <h2 className="text-white text-2xl font-semibold mb-4">Notifications for {type}</h2>
                <Table.Root className="w-full border">
                    <Table.Header className="">
                        <Table.Row className="bg-gray-700">
                            <Table.ColumnHeaderCell className="text-white">
                                Message
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white">
                                Person
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white">
                                Created At
                            </Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>{notifications && renderItems()}</Table.Body>
                </Table.Root>
            </div>
        </div>
    );
};

export default NotificationTable;
