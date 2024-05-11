/*import React, { Component } from 'react';

interface NotificationProps {
    userName?: string;
    gameName?: string;
}

interface NotificationItem {
    id: number;
    userName: string;
    gameName: string;
}

class NotificationBase extends Component<NotificationProps> {
    state = {
        notificationsQueue: [] as NotificationItem[],
        classNameYeah: 'container'
    };

    removeNotification = (id: number) => {
        this.setState(prevState => ({
            notificationsQueue: prevState.notificationsQueue.filter(item => item.id !== id)
        }));
    };

    addNotification = (userName: string, gameName: string) => {
        //console.log('Adding notification:', userName, gameName);
        const id = Math.floor(Math.random() * 1000000); // Generating a unique ID
        const newNotification = { id, userName, gameName };
        //console.log('New notification:', newNotification);
        this.setState(prevState => ({
            notificationsQueue: [...prevState.notificationsQueue, newNotification]
        }));
        /*this.setState(prevState => ({
            notificationsQueue: newNotification
        }), () => {
            console.log('Updated queue:', this.state.notificationsQueue);
        });
        //console.log(this.state.notificationsQueue)
    };


    componentDidMount() {
        this.interval = setInterval(() => {
            if (this.state.notificationsQueue.length > 0) {
                const notification = this.state.notificationsQueue[0];
                this.removeNotification(notification.id);
            }
        }, 3000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const { notificationsQueue, classNameYeah } = this.state;
        console.log(notificationsQueue)
        return (
            <div>
                {notificationsQueue.map((notification, index) => (
                    <div key={notification.id} className={classNameYeah} style={{ top: index * 70 }}>
                        <div>
                            <div className="green-div"></div>
                            <img className="booimg" src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/262060/1ee7acc9d8189c0a8ae756e9d9cde959e4b915ec.gif" alt="User Avatar" />
                        </div>
                        <div>
                            <div className="text">{notification.userName}</div>
                            <div className="text">is now playing</div>
                            <div className="text">{notification.gameName}</div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

export default NotificationBase;
*/
import React, { useState, useEffect, Component } from 'react';

interface NotificationProps {
    userName?: string;
    gameName?: string;
}

interface NotificationItem {
    id: number;
    userName: string;
    gameName: string;
}

interface NotificationRendererProps {
    notifications: NotificationItem[];
    classNameYeah: string;
}


export const NotificationRenderer: React.FC<NotificationRendererProps> = ({ notifications, classNameYeah }) => (
    <div>
        {notifications.map((notification, index) => {
            if (index % 2 !== 0) {
                return (
                    <div key={notification.id} className={classNameYeah}>
                        <div>
                            <div className="green-div"></div>
                            <img className="booimg" src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/262060/1ee7acc9d8189c0a8ae756e9d9cde959e4b915ec.gif" alt="User Avatar" />
                        </div>
                        <div>
                            <div className="text">{notification.userName}</div>
                            <div className="text">is now playing</div>
                            <div className="text">{notification.gameName}</div>
                        </div>
                    </div>
                );
            } else {
                return null; // Rendering every other notification
            }
        })}
    </div>
);

export const Notification = ({ name, game, position }) => {
    const [containerClass, setContainerClass] = useState('container');

    return (
        <div className={containerClass} style={{ top: position }}>
            <div>
                <div className="green-div"></div>
                <img className="booimg" src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/262060/1ee7acc9d8189c0a8ae756e9d9cde959e4b915ec.gif" alt="Avatar" />
            </div>
            <div>
                <div className="text">{name}</div>
                <div className="text">is now playing</div>
                <div className="text">{game}</div>
            </div>
        </div>
    );
};


interface NotificationItem {
    id: number;
    userName: string;
    gameName: string;
}

interface NotificationManagerState {
    notificationsQueue: NotificationItem[];
}

export class NotificationManager extends Component<{}, NotificationManagerState> {
    state: NotificationManagerState = {
        notificationsQueue: []
    };

    removeNotification = (id: number) => {
        this.setState(prevState => ({
            notificationsQueue: prevState.notificationsQueue.filter(item => item.id !== id)
        }));
    };

    addNotification = (userName: string, gameName: string) => {
        const id = Math.floor(Math.random() * 1000000);
        const newNotification = { id, userName, gameName };
        this.setState(prevState => ({
            notificationsQueue: [...prevState.notificationsQueue, newNotification]
        }), () => {
            console.log('Updated queue:', this.state.notificationsQueue);
        });
    };

    render() {
        const { notificationsQueue } = this.state;
        const classNameYeah = 'container'; // Assuming this is a default class

        return (
            <div>
                <NotificationRenderer notifications={notificationsQueue} classNameYeah={classNameYeah} />
            </div>
        );
    }
}

export default NotificationManager;
